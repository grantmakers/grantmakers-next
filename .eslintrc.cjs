// This configuration only applies to the Turborepo root.
// It extends the core config defined in /library.js, to handle any Typescript files in /shared
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: [
    'apps/**',
    'packages/**',
    // .gitignore file is not longer supported
    '.DS_Store',
    'node_modules',
    '/build',
    '/.wrangler',
    '/.svelte-kit',
    '/package',
    '.dev.vars',
    '.env',
    '.env.*',
    '!.env.example',
  ],
  extends: ['@repo/eslint-config/library.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: true,
  },
  plugins: ['@typescript-eslint'],
};
