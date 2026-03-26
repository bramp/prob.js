const prettier = require('eslint-plugin-prettier');
const prettierConfig = require('eslint-config-prettier');
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  prettierConfig,
  {
    ignores: ['dist/**', 'coverage/**', 'build/**'],
  },
  {
    plugins: {
      prettier,
    },
    rules: {
      'prettier/prettier': 'error',
      'no-unused-vars': 'warn',
      'no-undef': 'error',
      'no-global-assign': 'off',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'commonjs',
      globals: {
        window: 'readonly',
        document: 'readonly',
        module: 'writable',
        require: 'readonly',
        exports: 'writable',
        Random: 'readonly',
        Prob: 'writable',
        QUnit: 'readonly',
        define: 'readonly',
        process: 'readonly',
        console: 'readonly',
        self: 'readonly',
        global: 'readonly',
        __dirname: 'readonly',
        _: 'readonly',
        Plotly: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
];
