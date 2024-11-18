import type { HandleServerError } from '@sveltejs/kit';

export async function handle({ event, resolve }) {
  const legacySiteRedirects: Record<string, string> = {
    '/sitemap-main.xml': '/sitemaps/sitemap-main.xml',
  };

  if (legacySiteRedirects[event.url.pathname]) {
    return Response.redirect(new URL(legacySiteRedirects[event.url.pathname], event.url.origin), 301);
  }

  return resolve(event);
}

/**
 * Utility to improve error logging
 *
 * It attempts to capture component-level information
 * It then make an attempt to retry the request
 */
export const handleError: HandleServerError = async ({ error }) => {
  // Capture "window is undefined" errors likely caused by a SSR-generated component using a browser API, e.g. Chart.js
  if (error instanceof ReferenceError && error.message === 'window is not defined') {
    console.error('Window Reference Error:', error.stack);
  }
  // Capture all other error
  if (error) {
    console.log(error);
  }
  return {
    message: 'Internal Server Error',
  };
};
