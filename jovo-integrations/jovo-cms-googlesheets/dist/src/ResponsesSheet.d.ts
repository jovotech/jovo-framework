import { Extensible, HandleRequest } from 'jovo-core';
import { DefaultSheet, GoogleSheetsSheet } from './DefaultSheet';
export interface Config extends GoogleSheetsSheet {
    spreadsheetId?: string;
    sheet?: string;
    range?: string;
    i18Next?: {
        load?: string;
        returnObjects?: boolean;
        interpolation?: {
            escapeValue: boolean;
        };
    };
}
export declare class ResponsesSheet extends DefaultSheet {
    config: Config;
    constructor(config?: Config);
    install(extensible: Extensible): void;
    parse(handleRequest: HandleRequest, values: any[]): void;
}
