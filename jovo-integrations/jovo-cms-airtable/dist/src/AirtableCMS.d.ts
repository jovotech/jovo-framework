import { BaseApp, BaseCmsPlugin, ExtensibleConfig } from 'jovo-core';
import { AirtableTable } from './DefaultTable';
import * as Airtable from 'airtable';
export interface Config extends ExtensibleConfig {
    apiKey?: string;
    baseId?: string;
    tables?: AirtableTable[];
    caching?: boolean;
}
export declare class AirtableCMS extends BaseCmsPlugin {
    config: Config;
    base: Airtable.Base;
    baseApp: any;
    constructor(config?: Config);
    install(app: BaseApp): void;
    loadTableData(loadOptions: LoadOptions): Promise<{}>;
    private retrieveAirtableData;
    private shiftLastItemToFirstIndex;
}
interface LoadOptions {
    table: string;
    order?: string[];
    selectOptions?: {
        fields?: string[];
        filterByFormula?: string;
        maxRecords?: number;
        sort?: object[];
        view?: string;
    };
}
export {};
