import {Extensible, JovoError, HandleRequest, PluginConfig, Plugin, Log, ErrorCode} from "jovo-core";
import {AirtableCMS} from "./AirtableCMS";
import _merge = require('lodash.merge');

export interface AirtableSheet extends PluginConfig {
    name?: string;
    type?: string;
    table?: string;
}

export class DefaultSheet implements Plugin {
    config: AirtableSheet = {
        enabled: true,
    }

    cms?: AirtableCMS;

    constructor(config?: AirtableSheet) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(extensible: Extensible) {
        this.cms = extensible as AirtableCMS;
        extensible.middleware('retrieve')!.use(this.retrieve.bind(this));
    }

    uninstall(cms: Extensible) {

    }

    async retrieve(handleRequest: HandleRequest) {        
        if (!this.cms) {
            return Promise.reject('No cms initialized.');
        }
        if (!this.config.table) {
            return Promise.reject('table has to be set.');
        }
        if (!this.config.name) {
            return Promise.reject('sheet name has to be set.');
        }

        const values = await this.cms.loadSpreadSheetData(this.config.table);
        
        if (values) {
            this.parse(handleRequest, values);
        }
    }

    parse(handleRequest: HandleRequest, values: {}) { // tslint:disable-line
        handleRequest.app.$cms[this.config.name!] = values;
    }
}