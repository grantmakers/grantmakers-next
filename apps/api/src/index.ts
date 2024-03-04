/**
 * Grantmakers NEXT static API proof of concept
 *
 * Fetches static JSON files from Cloudflare R2
 * Uses basic API key-based auth during validation phase
 *
 * Not yet intended for public consumption
 */
import apiRouter from './router';
import { isGet, hasValidKey } from './utils/validators';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    // Quick GET check until full CORS is implemented
    if (!isGet(request)) {
      return new Response('Unauthorized request method', { status: 400 });
    }

    // Interim API key-based auth
    if (!hasValidKey(request, env)) {
      return new Response('Invalid API key', { status: 401 });
    }

    /**
     * Profiles handler
     */
    const profilesEndpoint = "/api/profiles/v1";

    if (url.pathname.startsWith(profilesEndpoint)) {
      return apiRouter.handle(request, env);
    }

    /**
     * Catch-all handler
     */
    const catchAllResponseMessage = 'ok';
    return new Response(JSON.stringify({ status: catchAllResponseMessage }), {
      headers: { 'Content-Type': 'application/json' },
    });
  },
};
