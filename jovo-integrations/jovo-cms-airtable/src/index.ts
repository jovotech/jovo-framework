export { DefaultTable } from './DefaultTable';
export { AirtableCMS } from './AirtableCMS';
export { ObjectArrayTable } from './ObjectArrayTable';
export { ResponsesTable } from './ResponsesTable';
export { KeyValueTable } from './KeyValueTable';

declare module 'jovo-core/dist/src/Cms' {
    interface Cms {
        t(): string | string[] | object | object[];
        i18Next: any; // tslint:disable-line
    }
}
