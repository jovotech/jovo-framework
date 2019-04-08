import { BaseCmsPlugin, ExtensibleConfig, ActionSet, BaseApp, HandleRequest, JovoError, ErrorCode } from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');

import { DefaultTable, AirtableTable } from './DefaultTable';
import { ObjectArrayTable } from './ObjectArrayTable';
import { ResponsesTable } from './ResponsesTable';
import { KeyValueTable } from './KeyValueTable';

import Airtable = require('airtable');

export interface Config extends ExtensibleConfig {
    apiKey?: string;
    baseId?: string;
    tables?: AirtableTable[];
    caching?: boolean;
}

export class AirtableCMS extends BaseCmsPlugin {
    config: Config = {
        enabled: true,
        apiKey: undefined,
        baseId: undefined,
        tables: [],
        caching: true,
    };
    base!: Airtable["Base"]["baseFn"];
    baseApp: any;   // tslint:disable-line

    constructor(config?: Config) {
        super(config);

        if (config) {
            this.config = _merge(this.config, config);
        }
        this.actionSet = new ActionSet([
            'retrieve'
        ], this);
    }

    install(app: BaseApp) {        
        super.install(app);
        this.baseApp = app;
        app.middleware('setup')!.use(this.retrieveSpreadsheetData.bind(this));

        const defaultSheetMap: {[key: string]: any} = { // tslint:disable-line
            'default': DefaultTable,
            'responses': ResponsesTable,
            'keyvalue': KeyValueTable,
            'objectarray': ObjectArrayTable
        };

        if (this.config.tables) {
            this.config.tables.forEach((table: AirtableTable) => {
                let type = undefined;
                if (!table.type) {
                    type = 'Default';
                }
                if (table.type && defaultSheetMap[table.type.toLowerCase()]) {
                    type = table.type.toLowerCase();
                }
                if (type) {
                    this.use(new defaultSheetMap[type.toLowerCase()](table));
                }
            });
        }
        if (!this.config.apiKey) {
            throw new JovoError(
                'Can\'t find api key',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'To use the Airtable integration you have to provide a valid api key',
                'You can find your api key on https://airtable.com/api'
            );
        }
        if (!this.config.baseId) {
            throw new JovoError(
                'Can\'t find baseId',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'To use the Airtable integrations you have to provide a baseId',
                'You can find your baseId on https://airtable.com/api'
            );
        }

        this.base = new Airtable({apiKey: this.config.apiKey}).base(this.config.baseId);
    }

    uninstall(app: BaseApp) {

    }

    private async retrieveSpreadsheetData(handleRequest: HandleRequest) {
        await this.middleware('retrieve')!.run(handleRequest, true);
    }

    async loadTableData(selectOptions: AirtableTable["selectOptions"], table: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            const arr: object[] = [];
        
            this.base(table).select(selectOptions!).eachPage((records: object[], fetchNextPage: () => void) => {
                /**
                 * This function (`page`) will get called for each page of records.
                 * records is an array of objects where the keys are the first row of the table and the values are the current rows values.
                 * The primary field of the table is at the last spot of the object, besides that the object has the same order as the table itself
                 * To maintain the same structure as the jovo-cms-googlesheets integration, the data will be converted to an array of arrays
                 */ 

                // push keys first as that's the first row of the table and put the last key at the first spot of the array. 
                const record = _get(records[0], 'fields');
                let keys = Object.keys(record);
                keys = this.shiftLastItemToFirstIndex(keys);
                arr.push(keys);

                records.forEach((record: object) => {
                    // push each records values
                    let values = Object.values(_get(record, 'fields'));
                    values = this.shiftLastItemToFirstIndex(values);
                    arr.push(values);
                });
    
                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                fetchNextPage();
    
            }, ((err: Error) => {
                if (err) {                    
                    return reject(new JovoError(
                        err.message,
                        err.name,
                        'jovo-cms-airtable'
                    ));
                }                
                return resolve(arr);
            }));
        });
    }

    private shiftLastItemToFirstIndex(arr: any[]) { // tslint:disable-line
        const lastItem = arr.pop();
        arr.unshift(lastItem);
        return arr;
    }
}