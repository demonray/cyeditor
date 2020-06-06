module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    '@vue/typescript',
    'plugin:vue/recommended',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    parser: "@typescript-eslint/parser",
    sourceType: 'module'
  },
  rules: {
    'comma-dangle': 0,
    '@typescript-eslint/indent': [
      'error',
      2,
      {
          'SwitchCase': 1
      }
    ],
    '@typescript-eslint/member-delimiter-style': 0
  }
}
