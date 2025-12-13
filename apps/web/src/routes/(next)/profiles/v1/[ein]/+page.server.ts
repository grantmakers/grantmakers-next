import { dev } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { WORKER_URL, PROFILES_API_ENDPOINT, AUTH_PRIVATE_KEY, WAF_AUTH_VERIFY_KEY } from '$env/static/private';
import { isValidEin } from '@repo/shared/utils/validators';
import type { PageServerLoad } from './$types';
import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';
import type { R2Bucket } from '@cloudflare/workers-types';

const remoteUrl = WORKER_URL + PROFILES_API_ENDPOINT + '/';

const fetchProfileFromR2Binding = async (bucket: R2Bucket, ein: string): Promise<GrantmakersExtractedDataObj | null> => {
  const key = `profiles/${ein}.json`;
  const object = await bucket.get(key);

  if (!object) {
    return null;
  }

  const profile = object.json<GrantmakersExtractedDataObj>();
  return profile;
};

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

const getProfile = async (ein: string, platform?: App.Platform): Promise<GrantmakersExtractedDataObj | null> => {
  // In development, fetch profiles from local MongoDB instance
  if (dev) {
    try {
      const profile = await fetchLocalProfile(ein);
      return profile;
    } catch (error) {
      console.warn('Local fetch failed, falling back to remote:', error);
      return await fetchRemoteProfile(ein, remoteUrl);
    }
  }

  // In production, use Cloudflare R2 Binding to fetch profile
  const bucket = platform?.env?.R2_V1_POC0;
  if (!bucket) {
    throw error(500, 'R2 binding not available');
  }
  return await fetchProfileFromR2Binding(bucket, ein);
};

export const load: PageServerLoad = async ({ params, url, platform }) => {
  // This main dynamic route handles two scenarios:
  // 1. The full canonical url: [ein]-[slugified-org-name]
  // 2. The ein-only helper router: [ein]
  // We only need the EIN to fetch the data
  // In the case of the full canonical route, we handle the full url expansion on the client to avoid duplicating the data fetch via a full redirect
  const ein = params.ein.split('-')[0];

  if (!isValidEin(ein)) {
    throw error(400, {
      message: 'Invalid EIN format. Please check the EIN and try again.',
    });
  }

  let profile;
  try {
    profile = await getProfile(ein, platform);
  } catch (err) {
    console.error('Error in load function:', err);

    throw error(500, {
      message: 'An unexpected error occurred while fetching the foundation profile.',
    });
  }

  if (!profile) {
    throw error(404, {
      message: 'No profile found.',
    });
  }

  // Maintain existing SEO link equity by throwing a proper 301
  // This results in an extra round trip, but that's OK as Cloudflare is fast and we can add aggressive caching at the API level
  const canonicalPath = `/profiles/v1/${ein}-${profile.organization_name_slug}/`;
  const canonicalUrl = new URL(canonicalPath, url.origin).toString();
  if (url.pathname !== canonicalPath) {
    return redirect(301, canonicalUrl);
  }

  return { profile };
};
