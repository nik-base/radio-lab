// @ts-expect-error https://thymikee.github.io/jest-preset-angular/docs/getting-started/test-environment
globalThis.ngJest = {
  testEnvironmentOptions: {
    errorOnUnknownElements: true,
    errorOnUnknownProperties: true,
  },
};
import { setupZoneTestEnv } from 'jest-preset-angular/setup-env/zone';

setupZoneTestEnv();
/*
  Referred from https://github.com/jsdom/jsdom/issues/2177#issuecomment-1724971596
  Ignore CSS parsing error due to known issue with jest and jsDOM
  Issue links -
  https://github.com/jsdom/jsdom/issues/2177
  https://github.com/thymikee/jest-preset-angular/issues/2194
  https://github.com/primefaces/primeng/issues/14085
*/
const originalConsoleError: (...params: unknown[]) => void = console.error;

const jsDomCssError: string = 'Error: Could not parse CSS stylesheet';

console.error = (...params: unknown[]): void => {
  if (
    !params.find(
      (param: unknown): boolean =>
        param?.toString()?.includes(jsDomCssError) ?? false
    )
  ) {
    originalConsoleError(...params);
  }
};
