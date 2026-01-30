import type { Profile } from '@repo/shared/typings/sitemaps';
import { originProd as hostname, cutoverDate, profilesVersionProd } from '@repo/shared/constants/trustedConstants';

/**
 * Returns the appropriate lastmod date for sitemap entries.
 * Uses cutoverDate as a floor to avoid showing very old dates for rarely-updated profiles.
 */
export const chooseDate = (processed: string, cutover: string) => {
  if (processed > cutover) return processed;
  return cutover;
};

export const generateSitemap = (profiles: Profile[]) => {
  const urlset = profiles
    .map(
      (profile) => `
    <url>
      <loc>${hostname}/profiles/${profilesVersionProd}/${profile.ein}-${profile.organization_name_slug}/</loc>
      <lastmod>${chooseDate(profile.last_updated_grantmakers, cutoverDate)}</lastmod>
    </url>`,
    )
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlset}
    </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  );
};
