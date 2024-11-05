const { resolve } = require('node:path');

const project = resolve(process.cwd(), 'tsconfig.json');

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    'eslint:recommended',
    'eslint-config-turbo',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  plugins: ['only-warn', '@typescript-eslint'],
  globals: {
    JSX: true,
  },
  env: {
    node: true,
  },
  settings: {
    'import/resolver': {
      typescript: {
        project,
      },
    },
  },
  ignorePatterns: [
    // Ignore dotfiles
    '.*.cjs',
    '.*.js',
    'node_modules/',
    'dist/',
  ],
  overrides: [
    {
      files: ['*.js?(x)', '*.ts?(x)'],
    },
  ],
  rules: {
    // Consider: https://github.com/typescript-eslint/typescript-eslint/blob/main/packages/eslint-plugin/src/configs/recommended.ts
    '@typescript-eslint/no-unused-vars': 'error',
    'no-unused-vars': 'off',
    'eol-last': ['error', 'always'],
  },
};
