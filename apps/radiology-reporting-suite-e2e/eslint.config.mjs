import playwright from 'eslint-plugin-playwright';

import eslintBaseConfig from '../../eslint.config.mjs';


export const eslintTestConfig = [
  playwright.configs['flat/recommended'],

  ...eslintBaseConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    // Override or add rules here
    rules: {},
  },
];

export default eslintTestConfig 
