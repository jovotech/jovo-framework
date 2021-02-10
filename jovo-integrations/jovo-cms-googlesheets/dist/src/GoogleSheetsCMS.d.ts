import { BaseApp, BaseCmsPlugin, ExtensibleConfig } from 'jovo-core';
import { GoogleSheetsSheet } from './DefaultSheet';
export interface Config extends ExtensibleConfig {
    credentialsFile?: string;
    spreadsheetId?: string;
    sheets?: GoogleSheetsSheet[];
    access?: string;
    caching?: boolean;
}
export declare class GoogleSheetsCMS extends BaseCmsPlugin {
    config: Config;
    jwtClient: any;
    baseApp: any;
    constructor(config?: Config);
    install(app: BaseApp): void;
    loadPublicSpreadsheetData(spreadsheetId: string, sheetPosition?: number): Promise<any>;
    loadPrivateSpreadsheetData(spreadsheetId: string, sheet: string, range: string): Promise<any[]>;
    private retrieveSpreadsheetData;
    private initializeJWT;
    private authorizeJWT;
}
