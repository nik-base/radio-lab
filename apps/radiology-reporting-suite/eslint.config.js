const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.js');
const importPlugin = require('eslint-plugin-import');
const rxjsPlugin = require('eslint-plugin-rxjs-x');
const ngrxPlugin = require('@ngrx/eslint-plugin')

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  // ...importPlugin.configs.recommended,
  // ...rxjsPlugin.configs.recommended,
  // ...ngrxPlugin.configs.recommended,
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'app',
          style: 'kebab-case',
        },
      ],
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
