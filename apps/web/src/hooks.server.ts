import { redirect } from '@sveltejs/kit';
import type { HandleServerError } from '@sveltejs/kit';

type SitemapRedirects = { [key: string]: string };

const legacySitemapRedirects: SitemapRedirects = {
  '/sitemap-main.xml': '/sitemaps/sitemap-main.xml',
};

export async function handle({ event, resolve }) {
  const path = event.url.pathname;

  // Handle legacy sitemap redirect
  if (legacySitemapRedirects[path]) {
    return redirect(301, new URL(legacySitemapRedirects[path], event.url.origin));
  }

  // Handle legacy profiles 'v' redirect
  if (path.startsWith('/profiles/v0/')) {
    const newPath = path.replace('/profiles/v0/', '/profiles/v1/');
    return redirect(301, newPath);
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
