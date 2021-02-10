import { Extensible, HandleRequest, Plugin, PluginConfig } from 'jovo-core';
import { AirtableCMS } from './AirtableCMS';
export interface AirtableTable extends PluginConfig {
    caching?: boolean;
    name?: string;
    order?: string[];
    table?: string;
    type?: string;
    selectOptions?: {
        fields?: string[];
        filterByFormula?: string;
        maxRecords?: number;
        sort?: object[];
        view?: string;
    };
}
export declare class DefaultTable implements Plugin {
    config: AirtableTable;
    cms?: AirtableCMS;
    constructor(config?: AirtableTable);
    install(extensible: Extensible): void;
    retrieve(handleRequest: HandleRequest): Promise<undefined>;
    parse(handleRequest: HandleRequest, values: {}): void;
}
