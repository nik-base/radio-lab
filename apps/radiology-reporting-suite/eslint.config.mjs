
import angularTemplateParser from '@angular-eslint/template-parser';
import eslint from '@eslint/js';
import ngrxPlugin from '@ngrx/eslint-plugin/v9';
import nx from '@nx/eslint-plugin';
import importPlugin from 'eslint-plugin-import';
import rxjsPlugin from 'eslint-plugin-rxjs-x';
import tseslint from 'typescript-eslint';
import eslintBaseConfig from '../../eslint.config.mjs';

const eslintConfig = [
  ...eslintBaseConfig,
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
        tsconfigRootDir: import.meta.dirname,
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

export default eslintConfig;