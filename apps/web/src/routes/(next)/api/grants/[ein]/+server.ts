import { json, error } from '@sveltejs/kit';
import { isValidEin } from '@repo/shared/utils/validators';
import { WORKER_URL, GRANTS_API_ENDPOINT, AUTH_PRIVATE_KEY, WAF_AUTH_VERIFY_KEY } from '$env/static/private';
import type { RequestHandler } from './$types';

const endpoint = WORKER_URL + GRANTS_API_ENDPOINT + '/';

export const GET: RequestHandler = async ({ params }) => {
  const ein = params.ein;

  if (!isValidEin(ein)) {
    error(400, {
      message: 'Invalid EIN format. Please check the EIN and try again.',
    });
  }

  console.log(`Fetching grants for ${ein} from ${endpoint + ein}`);
  const response = await fetch(endpoint + ein, {
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

  // Return a proper Response object using the SvelteKit json helper
  return json(data);
};
