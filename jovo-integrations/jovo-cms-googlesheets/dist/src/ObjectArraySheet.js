"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const DefaultSheet_1 = require("./DefaultSheet");
class ObjectArraySheet extends DefaultSheet_1.DefaultSheet {
    constructor(config) {
        super(config);
        this.config = {
            enabled: true,
            name: undefined,
            range: 'A:Z',
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
        handleRequest.app.$cms[entity] = resultArray;
    }
}
exports.ObjectArraySheet = ObjectArraySheet;
//# sourceMappingURL=ObjectArraySheet.js.map