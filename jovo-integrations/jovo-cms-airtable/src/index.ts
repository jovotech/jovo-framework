export { DefaultSheet } from './DefaultSheet';
export { AirtableCMS } from './AirtableCMS';
export { ObjectArraySheet } from './ObjectArraySheet';
export { ResponsesSheet } from './ResponsesSheet';

declare module 'jovo-core/dist/src/Cms' {
    interface Cms {
        t(): string | string[] | object | object[];
        i18Next: any; // tslint:disable-line
    }
}
