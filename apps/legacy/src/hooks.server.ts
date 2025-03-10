import { redirect, type HandleServerError } from '@sveltejs/kit';

type Redirects = { [key: string]: string };

const deprecatedProfileSearchHelper = /^\/profiles\/(\d{9})\/?$/;
const profileRoutes = (ein: string) => `/profiles/v0/${ein}`;

const deprecatedProfilesIndexRoute = '/profiles/';
const profilesIndexRedirect = '/search/profiles/';

const legacySitemapRedirects: Redirects = {
  '/sitemap-main.xml': '/sitemaps/sitemap-main.xml',
};

const surpriseMeRoutes = ['/profiles/v0'];

export async function handle({ event, resolve }) {
  const path = event.url.pathname;

  // Handle deprecated profile search helper redirect
  const legacyProfileHelperMatch = path.match(deprecatedProfileSearchHelper);
  if (legacyProfileHelperMatch) {
    const ein = legacyProfileHelperMatch[1];
    redirect(301, profileRoutes(ein));
  }

  // Handle deprecated profiles full index route
  if (event.url.pathname === deprecatedProfilesIndexRoute) {
    redirect(301, profilesIndexRedirect);
  }

  // Handle legacy sitemap redirect
  if (legacySitemapRedirects[path]) {
    return Response.redirect(new URL(legacySitemapRedirects[path], event.url.origin), 301);
  }

  // Handle Surprise Me feature
  if (surpriseMeRoutes.some((route) => path.startsWith(route))) {
    const accessToken = event.url.searchParams.get('access');

    if (accessToken === 'welcome-friend') {
      event.cookies.set('surprise-me-access', 'granted', {
        path: '/',
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });

      // Clean the query param
      const redirectTo = event.url.pathname;
      redirect(302, redirectTo);
    }
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
