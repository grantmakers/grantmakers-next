import { generateSitemap } from '$utils/sitemap';
import sitemapData from '@repo/shared/data/public/sitemap-data.json';
import type { Profile } from '@repo/shared/typings/sitemaps';
import type { RequestHandler } from '@sveltejs/kit';

export const prerender = true;

const data: Profile[] = sitemapData as Profile[];

const targets = ['8'];

export const GET: RequestHandler = async () => {
  const filteredProfiles = data.filter((profile) => targets.includes(profile.ein.charAt(0)));
  return generateSitemap(filteredProfiles);
};
