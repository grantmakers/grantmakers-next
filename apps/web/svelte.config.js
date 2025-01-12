// import adapter from '@sveltejs/adapter-auto';
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // Consult https://kit.svelte.dev/docs/integrations#preprocessors
  // for more information about preprocessors
  preprocess: [vitePreprocess({})],

  kit: {
    // adapter-auto only supports some environments, see https://kit.svelte.dev/docs/adapter-auto for a list.
    // If your environment is not supported or you settled on a specific environment, switch out the adapter.
    // See https://kit.svelte.dev/docs/adapters for more information about adapters.
    // adapter: adapter(),
    adapter: adapter({
      routes: {
        include: ['/*'],
        exclude: ['<all>'],
      },
    }),
    alias: {
      '@repo/shared': '../../shared/*', // Monorepo 'shared' directory
      $src: './src', // Svelte src root
      $utils: './src/lib/utils', // Svelte utils
    },
    csp: {
      mode: 'auto',
      directives: {
        'script-src': [
          'self',
          'https://static.cloudflareinsights.com',
          'https://cdnjs.cloudflare.com/',
          'https://docs.google.com/',
          'https://cdn.iubenda.com',
          'unsafe-eval',
        ], // The unsafe-eval requirement is for Zaraz, a known CF issue required for now - Hashes will be added automatically
        'style-src': ['self', 'unsafe-inline', 'https://cdn.iubenda.com'], // Include 'unsafe-inline' for inline styles
        'frame-src': ['https://www.iubenda.com', 'https://docs.google.com/'],
        'frame-ancestors': ['https://docs.google.com/'],
        'connect-src': [
          'self',
          'https://cloudflareinsights.com',
          'https://*.algolia.net',
          'https://*.algolianet.com',
          'https://*.algolia.io',
        ],
        'default-src': ['none'],
        'img-src': ['self', 'data:', 'https://images.unsplash.com', 'https://cdn.iubenda.com', 'https://tailwindui.com'], // Added Unsplash domain
        'font-src': ['self', 'data:'],
        'object-src': ['none'],
        'base-uri': ['self'], // Move bak to 'none' when Materialize is fully removed
        'form-action': ['self'],
      },
    },
  },
};

export default config;
