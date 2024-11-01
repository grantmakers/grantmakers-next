// This configuration only applies to the Turborepo root.
// It extends the core config defined in /library.js, to handle any Typescript files in /shared
/** @type {import("eslint").Linter.Config} */
module.exports = {
  ignorePatterns: ['apps/**', 'packages/**'],
  extends: ['@repo/eslint-config/library.cjs'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: true,
  },
  plugins: ['@typescript-eslint'],
};
