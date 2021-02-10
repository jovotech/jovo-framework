import { HandleRequest } from 'jovo-core';
import { DefaultSheet, GoogleSheetsSheet } from './DefaultSheet';
export interface Config extends GoogleSheetsSheet {
}
export declare class KeyValueSheet extends DefaultSheet {
    config: Config;
    constructor(config?: Config);
    parse(handleRequest: HandleRequest, values: any[]): void;
}
