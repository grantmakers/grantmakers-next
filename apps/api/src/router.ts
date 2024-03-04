/**
 * This function explicity does NOT use the itty-router
 * response helper methods, e.g. json, text, and error
 *
 * The primary use(s) of itty-router are:
 * 1) Route patterns
 * 2) Chaining the route patterns
 */
import { Router } from 'itty-router';
import { fetchR2Object } from './r2';
import { isValidEin } from './utils/validators';

// eslint-disable-next-line new-cap
const router = Router();

const endpointProfilesIndex = '/api/v1/profiles';
const endpointGetProfileObject = '/api/v1/profiles/:ein';

// Use itty-router's chain feature to define all handlers
router
  .get(endpointProfilesIndex, () => new Response('Profiles Index coming soon'))

  .get(endpointGetProfileObject, async (request, env) => {
    const { params } = request;
    const ein = params.ein;
    const key = ein + '.json';

    // Validate EIN
    if (isValidEin(ein)) {
      return fetchR2Object(env, key);
    }

    return new Response('Invalid EIN format', { status: 400 });
  })

  // 404 for everything else
  .all('*', () => new Response('Not Found.', { status: 404 }));

export default router;
