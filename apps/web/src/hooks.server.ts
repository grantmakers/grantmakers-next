/**
 * Server-side hooks for request handling and security headers
 *
 * Redirect logic (legacy routes, deprecated paths) returns early.
 * All other requests receive security headers before being returned to the client.
 */
import { redirect } from '@sveltejs/kit';
import type { HandleServerError } from '@sveltejs/kit';

type Redirects = { [key: string]: string };

const deprecatedProfileSearchHelper = /^\/profiles\/(\d{9})\/?$/;
const profileRoutes = (ein: string) => `/profiles/v0/${ein}`;

const deprecatedProfilesIndexRoute = '/profiles/';
const profilesIndexRedirect = '/search/profiles/';

const legacySitemapRedirects: Redirects = {
  '/sitemap-main.xml': '/sitemaps/sitemap-main.xml',
};

const surpriseMeRoutes = ['/profiles/v0'];

const donationRoutes = ['/donate', '/buy-chad-a-coffee'];

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

  // Handle new donation paths
  if (donationRoutes.some((route) => path.startsWith(route))) {
    const redirectTo = `/about${event.url.pathname}`;
    redirect(302, redirectTo);
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

  // Preload fonts - only needed during legacy to NEXT transition
  // https://svelte.dev/docs/kit/performance#Optimizing-assets-Fonts
  const response = await resolve(event, {
    preload: ({ type }) => type === 'font' || type === 'js' || type === 'css',
  });

  // Add security headers to all responses
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), usb=(), interest-cohort=()');

  return response;
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
