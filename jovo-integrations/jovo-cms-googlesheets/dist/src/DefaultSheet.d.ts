import { Extensible, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import { GoogleSheetsCMS } from './GoogleSheetsCMS';
export interface GoogleSheetsSheet extends PluginConfig {
    name?: string;
    range?: string;
    spreadsheetId?: string;
    type?: string;
    access?: string;
    entity?: string;
    position?: number;
    caching?: boolean;
}
export declare class DefaultSheet implements Plugin {
    config: GoogleSheetsSheet;
    cms?: GoogleSheetsCMS;
    constructor(config?: GoogleSheetsSheet);
    install(extensible: Extensible): void;
    retrieve(handleRequest: HandleRequest): Promise<undefined>;
    parse(handleRequest: HandleRequest, values: any[]): void;
    /**
     * Parses public spreadsheet json to a private spreadsheet format
     * @param values
     * @returns {any[]}
     */
    private parsePublicToPrivate;
}
