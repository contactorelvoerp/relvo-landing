module.exports = {
  root: true,
  env: { browser: true, es2022: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', 'dist-ssr', 'remotion', 'reference', 'design-reference', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  globals: { __SHOW_PENDING__: 'readonly' },
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    'react/prop-types': 'off',
  },
  overrides: [
    { files: ['scripts/**', 'vite.config.js'], env: { node: true, browser: false } },
    { files: ['src/entry-*.jsx'], rules: { 'react-refresh/only-export-components': 'off' } },
  ],
}
