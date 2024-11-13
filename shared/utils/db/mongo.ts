import { MongoClient, Db } from 'mongodb';
import type { CollectionStats, GrantmakersRawFilingObj } from '@repo/shared/typings/irs/all.js';
import type { Collection, Document, InsertManyResult, OptionalUnlessRequiredId, CreateIndexesOptions, IndexDescription } from 'mongodb';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

export async function connectToDatabase(uri: string, dbName: string) {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();

    const db = client.db(dbName);
    console.log('✅ Connected to MongoDB instance');
    cachedClient = client;
    cachedDb = db;
    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Failed to connect to MongoDB');
  }
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  if (!cachedDb) {
    console.log('Database connection is not established');
    throw new Error('Database connection is not established');
  }
  return cachedDb.collection<T>(name);
}

export async function insertManyDocuments<T extends Document>(
  collectionName: string,
  documents: OptionalUnlessRequiredId<T>[],
): Promise<InsertManyResult<T>> {
  if (!cachedDb) {
    throw new Error('Database connection is not established');
  }

  try {
    const collection = cachedDb.collection<T>(collectionName);
    return await collection.insertMany(documents);
  } catch (error) {
    console.error(`Failed to insert documents into collection ${collectionName}:`, error);
    throw new Error(`Failed to insert documents into collection ${collectionName}`);
  }
}

export async function dropCollection(collectionName: string) {
  if (!cachedDb) {
    throw new Error('Database connection is not established');
  }

  const collectionList = await cachedDb.listCollections().toArray();
  const collectionExists = collectionList.some((col) => col.name === collectionName);

  if (collectionExists) {
    await cachedDb.collection(collectionName).drop();
  }
}

// TODO collStats command has been deprecate. Per the docs, need to use an aggregation pipeline now
// https://www.mongodb.com/docs/manual/reference/operator/aggregation/collStats/
export async function getCollectionStats(collectionName: string): Promise<CollectionStats> {
  if (!cachedDb) {
    throw new Error('Database connection is not established');
  }

  try {
    return (await cachedDb.command({ collStats: collectionName })) as CollectionStats;
  } catch (error) {
    console.error(`Failed to get stats for collection ${collectionName}:`, error);
    throw new Error(`Failed to get stats for collection ${collectionName}`);
  }
}

export async function createIndexes(
  collectionName: string,
  indexes: IndexDescription[],
  options?: CreateIndexesOptions,
): Promise<string[]> {
  /**
   * Usage...
    await createIndexes('someCollection', [
//   // Single field index with unique constraint
//   { key: { fieldName1: 1 }, unique: true },

//   // Another single field index
//   { key: { fieldName2: -1 } },

//   // Compound index
//   { key: { compoundKey1: 1, compoundKey2: -1 } }
// ]);
   */
  if (!cachedDb) {
    throw new Error('Database connection is not established');
  }

  try {
    const collection = cachedDb.collection(collectionName);
    return await collection.createIndexes(indexes, options);
  } catch (error) {
    console.error(`Failed to create indexes on ${collectionName}:`, error);
    throw new Error(`Failed to create indexes on ${collectionName}`);
  }
}

export async function closeConnection() {
  if (cachedClient) {
    await cachedClient.close();
    cachedClient = null;
    cachedDb = null;
  }
}

export async function handleDuplicateError(collection: Collection<GrantmakersRawFilingObj>, error: any): Promise<void> {
  if (error.code === 11000) {
    // Duplicate key error code
    // Find documents with the same irs_object_id
    const duplicateValue = error.keyValue.irs_object_id;
    const duplicates = await collection.find({ irs_object_id: duplicateValue }).toArray();

    if (duplicates.length <= 1) {
      return;
    }

    if (duplicates.length > 1) {
      // Sort by last_modified and keep the most recent
      duplicates.sort(
        (a, b) =>
          new Date(b.metadata.irs_xml_file_metadata.last_modified).getTime() -
          new Date(a.metadata.irs_xml_file_metadata.last_modified).getTime(),
      );

      const duplicatesCollection = await getCollection<GrantmakersRawFilingObj>('raw_filing_duplicates');
      for (const [i, duplicate] of duplicates.entries()) {
        if (!duplicate._id) return;

        // Move the older documents to the raw_filing_duplicates collection
        await duplicatesCollection.insertOne(duplicate);

        // Delete the duplicate
        await collection.deleteOne({ _id: duplicates[i]?._id });
      }
    }

    // TODO Retry creating the index
    // await createIndexes(collection, );
  } else {
    throw error; // Rethrow if it's not a duplicate key error
  }
}
