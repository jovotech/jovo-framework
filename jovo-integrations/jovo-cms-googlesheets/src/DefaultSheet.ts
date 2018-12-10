import {Extensible, HandleRequest, PluginConfig, Plugin} from "jovo-core";
import {GoogleSheetsCMS} from "./GoogleSheetsCMS";
import _merge = require('lodash.merge');

export interface GoogleSheetsSheet extends PluginConfig {
    name?: string;
    range?: string;
    spreadsheetId?: string;
    type?: string;
    access?: string;
    entity?: string;
    position?: number;

}

export class DefaultSheet  implements Plugin {

    config: GoogleSheetsSheet = {
        enabled: true,
        name: undefined,
        range: 'A:B',
    };

    cms?: GoogleSheetsCMS;


    constructor(config?: GoogleSheetsSheet) {
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.config.entity = this.config.entity || this.config.name;
    }

    install(extensible: Extensible) {
        this.cms = extensible as GoogleSheetsCMS;
        extensible.middleware('retrieve')!.use(this.retrieve.bind(this));

    }
    uninstall(cms: Extensible) {

    }

    async retrieve(handleRequest: HandleRequest) {

        if (!this.cms) {
            return Promise.reject('No cms initialized.');
        }
        const spreadsheetId = this.config.spreadsheetId || this.cms.config.spreadsheetId;

        if (!spreadsheetId) {
            return Promise.reject('SpreadsheetId has to be set.');
        }
        if (!this.config.name) {
            return Promise.reject('sheet name has to be set.');
        }
        if (!this.config.range) {
            return Promise.reject('range has to be set.');
        }
        let values: any[] = []; // tslint:disable-line
        if (!this.config.access && this.config.access === 'private') {
            values = await this.cms.loadPrivateSpreadsheetData(spreadsheetId, this.config.name, this.config.range);  // tslint:disable-line
        } else if (this.config.access === 'public') {
            const publicValues = await this.cms.loadPublicSpreadSheetData(spreadsheetId, this.config.position);  // tslint:disable-line
            values = this.parsePublicToPrivate(publicValues);
        }
        if (values) {
            this.parse(handleRequest, values);
        }
    }

    parse(handleRequest: HandleRequest, values: any[]) {  // tslint:disable-line
        if (!this.config.entity) {
            throw new Error('Entity has to be set.');
        }
        handleRequest.app.$cms[this.config.entity] = values;
    }

    /**
     * Parses public spreadsheet json to a private spreadsheet format
     * @param values
     * @returns {any[]}
     */
    private parsePublicToPrivate(values: any) { // tslint:disable-line
        const newValues: any[] = []; // tslint:disable-line
        const entries = values.feed.entry;
        const headers: string[] = [];

        entries.forEach((entry: any, index: number) => { // tslint:disable-line
            const row: string[] = [];
            // get headers
            if (index === 0) {
                Object.keys(entry).forEach((key: string) => {
                    if (key.startsWith('gsx$')) {
                        headers.push(key.substr(4));
                    }
                });
                newValues.push(headers);
            }
            // get values
            Object.keys(entry).forEach((key: string) => {
                if (key.startsWith('gsx$')) {
                    const cell = entry[key];
                    row.push(cell['$t']);
                }
            });
            newValues.push(row);


        });

        return newValues;
    }
}
