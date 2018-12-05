import {Extensible, HandleRequest, PluginConfig} from "jovo-core";
import {GoogleSheetsCMS} from "./GoogleSheetsCMS";
import * as _ from "lodash";


export interface Config extends PluginConfig {
    spreadsheetId?: string;
    name?: string;
    range?: string;
    entity?: string;
}

export class DefaultSheet {
    config: Config = {
        enabled: true,
        name: undefined,
        range: 'A:B',
    };
    cms?: GoogleSheetsCMS;
    constructor(config?: Config) {
        if (config) {
            this.config = _.merge(this.config, config);
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
        const values: any[] = await this.cms.loadSpreadsheetData(spreadsheetId, this.config.name, this.config.range);  // tslint:disable-line

        this.parse(handleRequest, values);
    }


    parse(handleRequest: HandleRequest, values: any[]) {  // tslint:disable-line
        if (!this.config.entity) {
            throw new Error('Entity has to be set.');
        }
        handleRequest.app.$cms[this.config.entity] = values;
    }
}
