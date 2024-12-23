import { originNext as hostname } from '$utils/trustedConstants';

export const prerender = true;

const routes = ['/', '/about'];

export async function GET() {
  const now = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
  const urlset = routes
    .map(
      (route: string) => `
    <url>
      <loc>${hostname}${route}</loc>
      <lastmod>${now}</lastmod>
    </url>
  `,
    )
    .join('');

  return new Response(
    `
		<?xml version="1.0" encoding="UTF-8" ?>
		<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
			${urlset}
		</urlset>`.trim(),
    {
      headers: {
        'Content-Type': 'application/xml',
      },
    },
  );
}
