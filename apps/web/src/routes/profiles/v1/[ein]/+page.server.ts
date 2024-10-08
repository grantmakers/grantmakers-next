import type { PageServerLoad } from './$types';
import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';
import { WORKER_URL, PROFILES_API_ENDPOINT, AUTH_PRIVATE_KEY, WAF_AUTH_VERIFY_KEY } from '$env/static/private';

const remoteUrl = WORKER_URL + PROFILES_API_ENDPOINT + '/';

const fetchRemoteProfile = async (ein: string, url: string): Promise<GrantmakersExtractedDataObj> => {
  console.log(`Fetching profile for ${ein} at ${url + ein}`);
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

  return await response.json();
};

const getProfile = async (ein: string): Promise<GrantmakersExtractedDataObj> => {
  return await fetchRemoteProfile(ein, remoteUrl);
};

export const load: PageServerLoad = async ({ params }) => {
  const { ein } = params;

  try {
    const profile = await getProfile(ein);
    return {
      foundationData: { profile },
    };
  } catch (error) {
    console.error('Error in load function:', error);
    throw error;
  }
};
