const baseConfig = require('../../.prettierrc.cjs');

module.exports = {
  ...baseConfig,
  plugins: [...baseConfig.plugins, 'prettier-plugin-svelte'],
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
