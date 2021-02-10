import { HandleRequest } from 'jovo-core';
import { AirtableTable, DefaultTable } from './DefaultTable';
export interface Config extends AirtableTable {
}
export declare class ObjectArrayTable extends DefaultTable {
    config: Config;
    constructor(config?: Config);
    parse(handleRequest: HandleRequest, values: any[]): void;
}
