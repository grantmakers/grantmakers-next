import { AUTH_PRIVATE_KEY, WAF_AUTH_VERIFY_KEY, MONGODB_URI, MONGODB_DB } from '$env/static/private';
import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
import type { R2Bucket } from '@cloudflare/workers-types';

export const fetchProfileFromR2Binding = async (bucket: R2Bucket, ein: string): Promise<GrantmakersExtractedDataObj | null> => {
  console.log(`Fetching profile for ${ein} via R2 binding`);
  const key = `profiles/${ein}.json`;
  const object = await bucket.get(key);

  if (!object) {
    return null;
  }

  const profile = object.json<GrantmakersExtractedDataObj>();
  return profile;
};

export const fetchRemoteProfile = async (ein: string, url: string): Promise<GrantmakersExtractedDataObj> => {
  console.log(`Fetching profile for ${ein} from ${url + ein}`);
  const response = await fetch(url + ein, {
    method: 'GET',
    headers: {
      'X-Custom-Auth-Key': AUTH_PRIVATE_KEY,
      'X-WAF-Auth-Verify': WAF_AUTH_VERIFY_KEY,
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching data: ${response.statusText}`);
  }

  const data = await response.json();
  return data;
};

export const fetchLocalProfile = async (ein: string): Promise<GrantmakersExtractedDataObj> => {
  const { connectToDatabase, getCollection } = await import('@repo/shared/utils/db/mongo');
  const uri = MONGODB_URI;
  const dbName = MONGODB_DB;
  const collectionName = 'r2';

  try {
    console.log(`Fetching local profile for ${ein} from MongoDB`);
    if (!uri || !dbName) {
      throw new Error('MongoDB URI and database name are required');
    }
    await connectToDatabase(uri, dbName);
    const collection = await getCollection<GrantmakersExtractedDataObj>(collectionName);

    const profile = await collection.findOne(
      { ein },
      {
        projection: {
          // These will only exist if pulling from the 'aggregated' collection
          // These are filtered out from the aggregated collection in the to-r2-profiles reducer
          phone: 0,
          organization_name_legacy_slug: 0,
          organization_names_all_years: 0,
          grants_last_three_years: 0,
        },
      },
    );

    if (!profile) {
      throw new Error(`Profile not found for EIN: ${ein}`);
    }

    return profile;
  } catch (error) {
    console.error('Error fetching from MongoDB:', error);
    throw new Error(`Failed to fetch profile from MongoDB: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};
