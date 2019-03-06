import {HandleRequest, JovoError, ErrorCode} from "jovo-core";
import {AirtableSheet, DefaultSheet} from "./DefaultSheet";

import _merge = require('lodash.merge');
import _set = require('lodash.set');

export interface Config extends AirtableSheet {

}

export class KeyValueSheet extends DefaultSheet {
    config: Config = {
        enabled: true
    };
    constructor(config?: Config) {
        super(config);
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    parse(handleRequest: HandleRequest, values: any[]) { // tslint:disable-line

        const kv = {};

        for (let i = 1; i < values.length; i++) {
            const row: string[] = values[i];
            for (let j = 1; j < row.length; j++) {
                const cell: string = row[j];
                _set(kv, `${row[0]}`, cell);
            }
        }

        if (!this.config.name) {
            throw new JovoError(
                'Name has to be set',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'The sheet\'s name has to be defined in your config.js file',
                undefined,
                'https://www.jovo.tech/docs/cms/airtable#configuration'
            );
        }

        handleRequest.app.$cms[this.config.name!] = kv;
    }
}