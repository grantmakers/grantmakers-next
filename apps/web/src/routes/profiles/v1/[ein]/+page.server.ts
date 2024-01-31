import type { PageServerLoad } from './$types';
import type { GrantmakersExtractedDataObj } from '@shared/typings/grantmakers/grants';
import { WORKER_URL, PROFILES_API_ENDPOINT, AUTH_PRIVATE_KEY } from '$env/static/private';
import { meta } from '@utils/trustedConstants';

const {
  defaults: { title, description },
} = meta;

export const load: PageServerLoad = async ({ params, fetch }) => {
  const ein = params.ein;
  // const response = await fetch('/api/endpoint');
  // const data = await response.json();
  // const data = profile; // Access directly from the imported mock object
  const fetchProfile = async (ein: string): Promise<GrantmakersExtractedDataObj> => {
    const url = WORKER_URL + PROFILES_API_ENDPOINT + '/';
    console.log('Constructed R2 fetch URL:', url + ein);
    console.log('Fetching Profile for EIN:', ein);

    try {
      const workerResponse = await fetch(url + ein, {
        method: 'GET',
        headers: {
          'X-Custom-Auth-Key': AUTH_PRIVATE_KEY, // Use AUTH_PRIVATE_KEY from environment
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
  console.log('EIN:', params.ein);
  // console.log('Profile data:', data); // This works

  // const images = import.meta.glob('../../../../lib/assets/images/icons-letters/svg/**/*.svg');
  // console.log(images);
  // const fetchImage = images[`../../../../lib/assets/images/icons-letters/svg/${firstLetter}.svg`];
  // const image = await fetchImage();
  // if (!image) throw error(404, 'Not found');
  // console.log('Target image:', image);

  // Prefetch the image on the server
  // await fetch(`../../../../lib/assets/images/icons-letters/svg/${firstLetter}.svg`);

  console.log('Server title:', title);
  console.log('Server Description:', description);
  return {
    foundationData: { profile },
    title,
    description,
  };
};
