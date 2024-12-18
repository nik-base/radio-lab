const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.js');
const importPlugin = require('eslint-plugin-import');
const rxjsPlugin = require('eslint-plugin-rxjs-x');
const ngrxPlugin = require('@ngrx/eslint-plugin/v9');
const angularTemplateParser = require('@angular-eslint/template-parser');
const typscriptParser = require('@typescript-eslint/parser');
const tseslint = require('typescript-eslint');
const eslint = require('@eslint/js');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map((config) => ({
    ...config,
    files: ['**/*.ts'], // We use TS config only for TS files
  })),
  ...ngrxPlugin.configs.all.map((config) => ({
    ...config,
    files: ['**/*.ts'], // We use TS config only for TS files
  })),
  {
    plugins: {
      'eslint-plugin-import': importPlugin,
    },
  },
  {
    ...rxjsPlugin.configs.recommended,
    ...importPlugin.flatConfigs.recommended,
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: __dirname,
        parser: typscriptParser,
      }
    },
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/typedef': [
        'error',
        {
          arrayDestructuring: true,
          arrowParameter: true,
          memberVariableDeclaration: true,
          objectDestructuring: true,
          parameter: true,
          propertyDeclaration: true,
          variableDeclaration: true,
          variableDeclarationIgnoreFunction: true,
        },
      ],
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/explicit-function-return-type': [
        'error', 
        {
          allowConciseArrowFunctionExpressionsStartingWithVoid: false,
          allowDirectConstAssertionInArrowFunctions: true,
          allowedNames: [],
          allowExpressions: false,
          allowFunctionsWithoutTypeParameters: true,
          allowHigherOrderFunctions: true,
          allowIIFEs: false,
          allowTypedFunctionExpressions: true,
        }
      ],
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'radio',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'radio',
          style: 'kebab-case',
        },
      ],
      'eslint-plugin-import/order': [
        'error',
        {          
          groups: [
            'builtin',
            'external',
            'internal',
            'parent',
            'sibling',
            'index',
          ],
          'pathGroups': [
            {
              'pattern': '@app/**',
              'group': 'internal',
              'position': 'after'
            }
          ],
          'pathGroupsExcludedImportTypes': [],
          'newlines-between': 'always',
          distinctGroup: false,
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      '@ngrx/use-consistent-global-store-name': ['error', 'store$']
    },
  },
  {
    languageOptions: {
      parser: angularTemplateParser,
    },
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
