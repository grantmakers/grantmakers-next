import type { RequestHandler } from '@sveltejs/kit';
export const prerender = true;

export const GET: RequestHandler = async () => {
  const url = 'https://www.grantmakers.io';
  const lastmod = new Date().toISOString().split('.')[0] + 'Z';

  return new Response(
    `<?xml version="1.0" encoding="UTF-8" ?>
    <sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      <sitemap>
        <loc>${url}/sitemaps/sitemap-main.xml</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${url}/sitemaps/sitemap-profiles-ein-0-2.xml</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${url}/sitemaps/sitemap-profiles-ein-3-5.xml</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${url}/sitemaps/sitemap-profiles-ein-6-7-9.xml</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
      <sitemap>
        <loc>${url}/sitemaps/sitemap-profiles-ein-8.xml</loc>
        <lastmod>${lastmod}</lastmod>
      </sitemap>
    </sitemapindex>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  );
};
