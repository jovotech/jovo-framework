import _merge = require('lodash.merge');
import _set = require('lodash.set');

import { AirtableSheet, DefaultSheet } from "./DefaultSheet";
import { HandleRequest, JovoError, ErrorCode } from 'jovo-core';

export interface Config extends AirtableSheet {

}

export class ObjectArraySheet extends DefaultSheet {
    config: Config = {
        enabled: true
    };

    constructor(config?: Config) {
        super(config);
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    parse(handleRequest: HandleRequest, values: any[]) {
        console.log('ObjectArraySheet parse()');
        
        const resultArray = [];
        const keys = values[0];
        for (let i = 1; i < values.length; i++) {
            const row: string[] = values[i];
            const obj = {};

            for (let j = 0; j < row.length; j++) {
                const cell: string = row[j];
                _set(obj, `${keys[j]}`, cell);
            }
            resultArray.push(obj);
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
        handleRequest.app.$cms[this.config.name!] = resultArray;
    }
}