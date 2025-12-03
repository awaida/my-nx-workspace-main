import baseConfig from '../../eslint.config.mjs';

export default [
  ...baseConfig,
  {
    files: [
      'apps/mini-crm-e2e/**/*.ts',
      'apps/mini-crm-e2e/**/*.tsx',
      'apps/mini-crm-e2e/**/*.js',
      'apps/mini-crm-e2e/**/*.jsx',
    ],
    rules: {},
  },
  {
    files: ['apps/mini-crm-e2e/**/*.ts', 'apps/mini-crm-e2e/**/*.tsx'],
    rules: {},
  },
  {
    files: ['apps/mini-crm-e2e/**/*.js', 'apps/mini-crm-e2e/**/*.jsx'],
    rules: {},
  },
];

