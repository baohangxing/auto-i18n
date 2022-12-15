module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: '@antfu/eslint-config',
  parserOptions: {
    ecmaVersion: 2020,
  },
  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'camelcase': 0,
    'import/prefer-default-export': 0,
    'max-len': ['error', { code: 200 }],
    '@typescript-eslint/explicit-module-boundary-types': 0,
    'no-bitwise': 0,
    // '@typescript-eslint/no-explicit-any': ['off'],
  },
  overrides: [
  ],
}
