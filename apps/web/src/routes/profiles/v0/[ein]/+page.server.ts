import { dev } from '$app/environment';
import { error } from '@sveltejs/kit';
import { WORKER_URL, PROFILES_API_ENDPOINT, AUTH_PRIVATE_KEY, WAF_AUTH_VERIFY_KEY } from '$env/static/private';
import { isValidEin } from '@repo/shared/utils/validators';
import type { PageServerLoad } from './$types';
import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';

const remoteUrl = WORKER_URL + PROFILES_API_ENDPOINT + '/';

const fetchRemoteProfile = async (ein: string, url: string): Promise<GrantmakersExtractedDataObj> => {
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

const fetchLocalProfile = async (ein: string): Promise<GrantmakersExtractedDataObj> => {
  const { connectToDatabase, getCollection } = await import('@repo/shared/utils/db/mongo');
  const { MONGODB_URI, MONGODB_DB } = await import('$env/static/private');
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
          phone: 0,
          organization_name_slug: 0,
          organization_names_all_years: 0,
          grants_all_years: 0,
          grants: 0,
          // grants_current_year_top_20: 0,
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

/** Best of both worlds - fetch direct from the DB locally, fetch from scalable/low-cost R2 in production */
const getProfile = async (ein: string): Promise<GrantmakersExtractedDataObj> => {
  if (dev) {
    try {
      const profile = await fetchLocalProfile(ein);
      return profile;
    } catch (error) {
      console.warn('Local fetch failed, falling back to remote:', error);
      return await fetchRemoteProfile(ein, remoteUrl);
    }
  }
  return await fetchRemoteProfile(ein, remoteUrl);
};

export const load: PageServerLoad = async ({ params }) => {
  const { ein } = params;

  if (!isValidEin(ein)) {
    throw error(400, {
      message: 'Invalid EIN format. Please check the EIN and try again.',
    });
  }

  try {
    const profile = await getProfile(ein);
    return {
      foundationData: { profile },
    };
  } catch (err) {
    console.error('Error in load function:', err);

    throw error(500, {
      message: 'An unexpected error occurred while fetching the foundation profile.',
    });
  }
};
