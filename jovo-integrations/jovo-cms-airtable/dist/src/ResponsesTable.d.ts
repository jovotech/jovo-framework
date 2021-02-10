import { Extensible, HandleRequest } from 'jovo-core';
import { AirtableTable, DefaultTable } from './DefaultTable';
export interface Config extends AirtableTable {
    i18Next?: {
        load?: string;
        returnObjects?: boolean;
        interpolation?: {
            escapeValue: boolean;
        };
    };
}
export declare class ResponsesTable extends DefaultTable {
    config: Config;
    constructor(config?: Config);
    install(extensible: Extensible): void;
    parse(handleRequest: HandleRequest, values: any[][]): void;
    /**
     * Moves `value` to `index` for every arr in the 2 dimensional `array`
     * @param {any[][]} array
     * @param {any} value
     * @param {string} index
     */
    moveValueToIndexX(array: any[][], value: any, index: number): void;
}
