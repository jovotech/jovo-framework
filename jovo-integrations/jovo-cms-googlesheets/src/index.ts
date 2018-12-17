export { GoogleSheetsCMS } from './GoogleSheetsCMS';
export { KeyValueSheet } from './KeyValueSheet';
export { DefaultSheet } from './DefaultSheet';
export { ResponsesSheet } from './ResponsesSheet';

declare module 'jovo-core/dist/src/Cms' {
    interface Cms {
        t(): string;
        i18Next: any; // tslint:disable-line
    }
}
