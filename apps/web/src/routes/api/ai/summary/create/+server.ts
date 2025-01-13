import { MongoClient } from 'mongodb';
import type { RequestHandler } from '@sveltejs/kit';
import { json } from '@sveltejs/kit';
import { MONGODB_URI, MONGODB_DB } from '$env/static/private';

const client = new MongoClient(MONGODB_URI);

export async function POST({ request }) {
  try {
    const data = await request.json();
    await client.connect();
    const db = client.db(MONGODB_DB);
    const collection = db.collection('ai_summaries');

    const result = await collection.insertOne(data);

    return json({ status: 'success', insertedId: result.insertedId }, { status: 200 });
  } catch (error) {
    console.error('Error saving data to MongoDB:', error);
    return json({ status: 'error', message: error.message }, { status: 500 });
  } finally {
    await client.close();
  }
}
