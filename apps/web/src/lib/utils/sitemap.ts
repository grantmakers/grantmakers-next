import type { Profile } from '@repo/shared/typings/sitemaps';
import { originProd as hostname, cutoverDate } from '@repo/shared/constants/trustedConstants';

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
      <loc>${hostname}/profiles/${profile.ein}-${profile.organization_name_slug}</loc>
      <lastmod>${chooseDate(now, profile.last_updated_grantmakers, cutoverDate)}</lastmod>
    </url>`,
    )
    .join('');

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
      ${urlset}
    </urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  );
};
