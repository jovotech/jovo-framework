import { BaseCmsPlugin, ExtensibleConfig, ActionSet, BaseApp, HandleRequest, JovoError, ErrorCode } from 'jovo-core';
import _merge = require('lodash.merge');
import _get = require('lodash.get');

import { DefaultSheet, AirtableSheet } from './DefaultSheet';
import { ObjectArraySheet } from './ObjectArraySheet';
import { ResponsesSheet } from './ResponsesSheet';
import { KeyValueSheet } from './KeyValueSheet';

import Airtable = require('airtable');

export interface Config extends ExtensibleConfig {
    apiKey?: string;
    base?: string;
    sheets: AirtableSheet[];
}

export class AirtableCMS extends BaseCmsPlugin {
    config: Config = {
        enabled: true,
        apiKey: undefined,
        base: undefined,
        sheets: []
    };
    base!: Airtable["Base"]["baseFn"];

    constructor(config?: Config) {
        super(config);

        if (config) {
            this.config = _merge(this.config, config);
        }
        this.actionSet = new ActionSet([
            'retrieve'
        ], this);
    }

    async install(app: BaseApp) {
        console.log('Airtable install');
        
        super.install(app);
        app.middleware('setup')!.use(this.retrieveSpreadsheetData.bind(this));

        const defaultSheetMap: {[key: string]: any} = { // tslint:disable-line
            'default': DefaultSheet,
            'responses': ResponsesSheet,
            'keyvalue': KeyValueSheet,
            'objectarray': ObjectArraySheet
        };

        if (this.config.sheets) {
            this.config.sheets.forEach((sheet: AirtableSheet) => {
                let type = undefined;
                if (!sheet.type) {
                    type = 'Default';
                }
                if (sheet.type && defaultSheetMap[sheet.type.toLowerCase()]) {
                    type = sheet.type.toLowerCase();
                }
                if (type) {
                    this.use(new defaultSheetMap[type.toLowerCase()](sheet));
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

        if (!this.config.base) {
            throw new JovoError(
                'Can\'t find base',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'To use the Airtable integrations you have to provide a base',
                'You can find your base on https://airtable.com/api'
            );
        }

        this.base = new Airtable({apiKey: this.config.apiKey}).base(this.config.base);
    }

    uninstall(app: BaseApp) {

    }

    private async retrieveSpreadsheetData(handleRequest: HandleRequest) {
        await this.middleware('retrieve')!.run(handleRequest, true);
    }

    async loadSpreadSheetData(table: string): Promise<{}> {
        return new Promise((resolve, reject) => {
            let arr: object[] = [];
        
            this.base(table).select({
                view: 'Grid view'
            }).eachPage((records: object[], fetchNextPage: any) => { 
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

                records.forEach((record: any) => {
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

    private shiftLastItemToFirstIndex(arr: any[]) {
        const lastItem = arr.pop();
        arr.unshift(lastItem);
        return arr;
    }
}