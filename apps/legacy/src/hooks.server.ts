import type { HandleServerError } from '@sveltejs/kit';

type Redirects = { [key: string]: string };

const legacySitemapRedirects: Redirects = {
  '/sitemap-main.xml': '/sitemaps/sitemap-main.xml',
};

export async function handle({ event, resolve }) {
  const path = event.url.pathname;

  // Handle legacy sitemap redirect
  if (legacySitemapRedirects[path]) {
    return Response.redirect(new URL(legacySitemapRedirects[path], event.url.origin), 301);
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
