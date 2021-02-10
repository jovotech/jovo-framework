"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const DefaultSheet_1 = require("./DefaultSheet");
class KeyObjectSheet extends DefaultSheet_1.DefaultSheet {
    constructor(config) {
        super(config);
        this.config = {
            enabled: true,
            range: 'A:C',
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
        const fullObject = {};
        const attributes = values[0];
        for (let i = 1; i < values.length; i++) {
            const dataset = {};
            for (let j = 1; j < values[i].length; j++) {
                const v = values[i][j] && values[i][j].length ? values[i][j] : undefined;
                _set(dataset, `${attributes[j]}`, v);
            }
            _set(fullObject, `${values[i][0]}`, dataset);
        }
        handleRequest.app.$cms[entity] = fullObject;
    }
}
exports.KeyObjectSheet = KeyObjectSheet;
//# sourceMappingURL=KeyObjectSheet.js.map