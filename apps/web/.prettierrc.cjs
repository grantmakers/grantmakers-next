const baseConfig = require('../../.prettierrc.js');

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
