module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: '@antfu/eslint-config',
  parserOptions: {
    ecmaVersion: 13,
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'camelcase': 0,
    'import/prefer-default-export': 0,
    'max-len': ['error', { code: 110 }],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-bitwise': 0,
  },
  overrides: [
  ],
}
