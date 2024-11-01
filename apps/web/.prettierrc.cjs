const baseConfig = require('../../.prettierrc.cjs');

module.exports = {
  ...baseConfig,
  plugins: ['prettier-plugin-svelte', 'prettier-plugin-tailwindcss'],
  singleQuote: true,
  svelteIndentScriptAndStyle: true,
  overrides: [
    {
      files: '*.svelte',
      options: {
        parser: 'svelte',
      },
    },
  ],
};
