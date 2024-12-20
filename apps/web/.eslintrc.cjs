/** @type { import("eslint").Linter.Config } */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/library.cjs', 'eslint-config-typescript', 'plugin:svelte/recommended', 'prettier'],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 2020,
    extraFileExtensions: ['**/*.svelte', '.svelte ', '**/*.svelte.ts', '*.svelte.ts', '**/*.svelte.js', '*.svelte.js', '*.js'],
  },
  env: {
    browser: true,
    es2017: true,
    node: true,
  },
  overrides: [
    {
      files: ['*.svelte'],
      parser: 'svelte-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },
  ],
  // HACK A likely bug in eslint-plugin-svelte or an @svelte package is causing app.html to get flagged - low priority
  ignorePatterns: ['**/app.html'],
};
