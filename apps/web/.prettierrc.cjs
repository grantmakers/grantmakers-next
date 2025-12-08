const baseConfig = require('@repo/prettier-config/base.cjs');

module.exports = {
  ...baseConfig,
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  singleQuote: true,
  svelteIndentScriptAndStyle: true,
  printWidth: 140, // Ensure override of Svelte Prettier plugin
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
        printWidth: 140, // Override Svelte Prettier plugin
      },
    },
  ],
};
