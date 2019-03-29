import _merge = require('lodash.merge');
import _set = require('lodash.set');

import {DefaultSheet, GoogleSheetsSheet} from "./DefaultSheet";
import {HandleRequest} from "jovo-core";


export interface Config extends GoogleSheetsSheet {
}

export class ObjectArraySheet extends DefaultSheet {
    config: Config = {
        enabled: true,
        range: 'A:Z',
    };
    constructor(config?: Config) {
        super(config);
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    parse(handleRequest: HandleRequest, values: any[]) { // tslint:disable-line

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

        const entity = this.config.entity || this.config.name;
        if (!entity) {
            throw new Error('Entity has to be set.');
        }
        handleRequest.app.$cms[entity] = resultArray;
    }
}
