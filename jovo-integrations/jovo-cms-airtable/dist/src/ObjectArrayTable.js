"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const DefaultTable_1 = require("./DefaultTable");
class ObjectArrayTable extends DefaultTable_1.DefaultTable {
    constructor(config) {
        super(config);
        this.config = {
            enabled: true,
            selectOptions: {
                view: 'Grid view',
            },
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    parse(handleRequest, values) {
        // tslint:disable-line
        const name = this.config.name;
        if (!name) {
            throw new jovo_core_1.JovoError('name has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-airtable', `The sheet's name has to be defined in your config.js file`, undefined, 'https://www.jovo.tech/docs/cms/airtable#configuration');
        }
        const resultArray = [];
        const keys = values[0];
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            const obj = {};
            for (let j = 0; j < row.length; j++) {
                const cell = row[j];
                _set(obj, `${keys[j]}`, cell);
            }
            resultArray.push(obj);
        }
        handleRequest.app.$cms[name] = resultArray;
    }
}
exports.ObjectArrayTable = ObjectArrayTable;
//# sourceMappingURL=ObjectArrayTable.js.map