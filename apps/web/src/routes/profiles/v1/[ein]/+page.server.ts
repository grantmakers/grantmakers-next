import type { PageServerLoad } from './$types';
import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';
import { WORKER_URL, PROFILES_API_ENDPOINT, AUTH_PRIVATE_KEY, WAF_AUTH_VERIFY_KEY } from '$env/static/private';

export const load: PageServerLoad = async ({ params, fetch }) => {
  const ein = params.ein;
  const fetchProfile = async (ein: string): Promise<GrantmakersExtractedDataObj> => {
    const url = WORKER_URL + PROFILES_API_ENDPOINT + '/';
    console.log(`Fetching profile for ${ein} ata ${url + ein}`);

    try {
      const workerResponse = await fetch(url + ein, {
        method: 'GET',
        headers: {
          'X-Custom-Auth-Key': AUTH_PRIVATE_KEY,
          'X-WAF-Auth-Verify': WAF_AUTH_VERIFY_KEY,
        },
      });

      if (!workerResponse.ok) {
        throw new Error(`Error fetching data: ${workerResponse.statusText}`);
      }

      const profileData = await workerResponse.json();
      return profileData;
    } catch (error) {
      // TODO: Handle the error appropriately
      console.error('Error in fetchProfile:', error);
      throw error; // Re-throwing the error after logging it
    }
  };

  const profile = fetchProfile(ein);

  return {
    foundationData: { profile },
  };
};
