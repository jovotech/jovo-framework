import * as _ from "lodash";
import {DefaultSheet, GoogleSheetsSheet} from "./DefaultSheet";
import {HandleRequest} from "jovo-core";


export interface Config extends GoogleSheetsSheet {
}

export class KeyValueSheet extends DefaultSheet {
    config: Config = {
        enabled: true,
        range: 'A:B',
    };
    constructor(config?: Config) {
        super(config);
        if (config) {
            this.config = _.merge(this.config, config);
        }
    }

    parse(handleRequest: HandleRequest, values: any[]) { // tslint:disable-line

        const kv = {};

        for (let i = 1; i < values.length; i++) {
            const row: string[] = values[i];
            for (let j = 1; j < row.length; j++) {
                const cell: string = row[j];
                _.set(kv, `${row[0]}`, cell);
            }
        }
        const entity = this.config.entity || this.config.name;

        if (!entity) {
            throw new Error('Entity has to be set.');
        }

        handleRequest.app.$cms[entity] = kv;
    }
}
