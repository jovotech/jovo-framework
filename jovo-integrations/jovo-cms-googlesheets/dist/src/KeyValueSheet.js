"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const DefaultSheet_1 = require("./DefaultSheet");
class KeyValueSheet extends DefaultSheet_1.DefaultSheet {
    constructor(config) {
        super(config);
        this.config = {
            enabled: true,
            range: 'A:B',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    parse(handleRequest, values) {
        // tslint:disable-line
        const entity = this.config.entity || this.config.name;
        if (!entity) {
            throw new jovo_core_1.JovoError('entity has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', `The sheet's name has to be defined in your config.js file.`, undefined, 'https://www.jovo.tech/docs/cms/google-sheets#configuration');
        }
        const kv = {};
        for (let i = 1; i < values.length; i++) {
            const row = values[i];
            for (let j = 1; j < row.length; j++) {
                const cell = row[j];
                _set(kv, `${row[0]}`, cell);
            }
        }
        handleRequest.app.$cms[entity] = kv;
    }
}
exports.KeyValueSheet = KeyValueSheet;
//# sourceMappingURL=KeyValueSheet.js.map