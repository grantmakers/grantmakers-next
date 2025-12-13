import { dev } from '$app/environment';
import { error, redirect } from '@sveltejs/kit';
import { WORKER_URL, PROFILES_API_ENDPOINT } from '$env/static/private';
import { fetchRemoteProfile, fetchLocalProfile } from '$lib/server/profiles';
import { isValidEin } from '@repo/shared/utils/validators';
import type { PageServerLoad } from './$types';
import type { GrantmakersExtractedDataObj } from '@repo/shared/typings/grantmakers/all';

export const prerender = false;

const remoteUrl = WORKER_URL + PROFILES_API_ENDPOINT + '/';

const getProfile = async (ein: string): Promise<GrantmakersExtractedDataObj> => {
  // In development, fetch profiles from local MongoDB instance
  if (dev) {
    try {
      const profile = await fetchLocalProfile(ein);
      return profile;
    } catch (error) {
      console.warn('Local fetch failed, falling back to remote:', error);
      return await fetchRemoteProfile(ein, remoteUrl);
    }
  }
  // In production, fetch profiles using API
  return await fetchRemoteProfile(ein, remoteUrl);
};

export const load: PageServerLoad = async ({ params, url }) => {
  // This main dynamic route handles two scenarios:
  // 1. The full canonical url: [ein]-[slugified-org-name]
  // 2. The ein-only helper router: [ein]
  // We only need the EIN to fetch the data
  // In the case of the full canonical route, we handle the full url expansion on the client to avoid duplicating the data fetch via a full redirect
  const ein = params.ein.split('-')[0];

  if (!isValidEin(ein)) {
    throw error(400, {
      message: 'Invalid EIN format. Please check the EIN and try again.',
    });
  }

  let profile;
  try {
    profile = await getProfile(ein);
  } catch (err) {
    console.error('Error in load function:', err);

    throw error(500, {
      message: 'An unexpected error occurred while fetching the foundation profile.',
    });
  }

  // Maintain existing SEO link equity by throwing a proper 301
  // This results in an extra round trip, but that's OK as Cloudflare is fast and we can add aggressive caching at the API level
  const canonicalPath = `/profiles/v0/${ein}-${profile.organization_name_slug}/`;
  const canonicalUrl = new URL(canonicalPath, url.origin).toString();
  if (url.pathname !== canonicalPath) {
    return redirect(301, canonicalUrl);
  }

  return { profile };
};
