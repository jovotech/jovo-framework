"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const DefaultTable_1 = require("./DefaultTable");
class KeyValueTable extends DefaultTable_1.DefaultTable {
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
            throw new jovo_core_1.JovoError('name has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-airtable', `The table's name has to be defined in your config.js file`, undefined, 'https://www.jovo.tech/docs/cms/airtable#configuration');
        }
        const kv = {};
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            for (let j = 1; j < row.length; j++) {
                const cell = row[j];
                _set(kv, `${row[0]}`, cell);
            }
        }
        handleRequest.app.$cms[name] = kv;
    }
}
exports.KeyValueTable = KeyValueTable;
//# sourceMappingURL=KeyValueTable.js.map