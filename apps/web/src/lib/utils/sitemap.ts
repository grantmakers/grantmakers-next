import type { Profile } from '@repo/shared/typings/sitemaps';
import { originProd as hostname, cutoverDate } from '@repo/shared/constants/trustedConstants';

// HACK Hard coding this during the transition from legacy to prod is not ideal
const profilesVersion = 'v0';

export const chooseDate = (now: string, processed: string, cutover: string) => {
  if (cutover > now) return now; // The cutover date hasn't happened yet, use today's date instead so it's a valid date
  if (processed > cutover) return processed; // It's past the cutover date and there is recent filing update, use that update date
  return cutover; // Use the cutover date for most
};

export const generateSitemap = (profiles: Profile[]) => {
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const urlset = profiles
    .map(
      (profile) => `
    <url>
      <loc>${hostname}/profiles/${profilesVersion}/${profile.ein}-${profile.organization_name_slug}</loc>
      <lastmod>${chooseDate(now, profile.last_updated_grantmakers, cutoverDate)}</lastmod>
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
