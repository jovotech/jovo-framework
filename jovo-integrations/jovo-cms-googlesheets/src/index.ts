export { GoogleSheetsCMS } from './GoogleSheetsCMS';
export { KeyValueSheet } from './KeyValueSheet';
export { DefaultSheet } from './DefaultSheet';
export { ResponsesSheet } from './ResponsesSheet';
export { ObjectArraySheet } from './ObjectArraySheet';

declare module 'jovo-core/dist/src/Cms' {
    interface Cms {
        t(): string | string[] | object | object[];
        i18Next: any; // tslint:disable-line
    }
}
