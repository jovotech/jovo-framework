export { GoogleSheetsCMS } from './GoogleSheetsCMS';
export { KeyValueSheet } from './KeyValueSheet';
export { DefaultSheet } from './DefaultSheet';
export { ResponsesSheet } from './ResponsesSheet';
export { ObjectArraySheet } from './ObjectArraySheet';
export { KeyObjectSheet } from './KeyObjectSheet';

declare module 'jovo-core/dist/src/util/Cms' {
  interface Cms {
    t(): string | string[] | object | object[];
    i18Next: any; // tslint:disable-line
  }
}
