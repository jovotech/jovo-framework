"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
class DefaultTable {
    constructor(config) {
        this.config = {
            caching: true,
            enabled: true,
            order: [],
            selectOptions: {
                view: 'Grid view',
            },
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(extensible) {
        this.cms = extensible;
        extensible.middleware('retrieve').use(this.retrieve.bind(this));
        this.config.table = this.config.table || this.config.name;
        if (this.cms.config.caching === false || this.config.caching === false) {
            this.cms.baseApp.middleware('request').use(this.retrieve.bind(this));
        }
    }
    async retrieve(handleRequest) {
        if (!this.cms) {
            return Promise.reject(new jovo_core_1.JovoError('no cms initialized', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-airtable', `The cms object wasn't initialized at the time the plugin tried to retrieve the data.`));
        }
        if (!this.config.table) {
            return Promise.reject(new jovo_core_1.JovoError('table has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-airtable', 'The table name has to be defined in your config.js file', undefined, 'https://www.jovo.tech/docs/cms/airtable#configuration'));
        }
        if (!this.config.name) {
            return Promise.reject(new jovo_core_1.JovoError('name has to be set', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-airtable', `The sheet's name has to be defined in your config.js file`, undefined, 'https://www.jovo.tech/docs/cms/airtable#configuration'));
        }
        const loadOptions = {
            order: this.config.order,
            selectOptions: this.config.selectOptions,
            table: this.config.table,
        };
        const values = await this.cms.loadTableData(loadOptions);
        if (values) {
            this.parse(handleRequest, values);
        }
    }
    parse(handleRequest, values) {
        // tslint:disable-line
        handleRequest.app.$cms[this.config.name] = values;
    }
}
exports.DefaultTable = DefaultTable;
//# sourceMappingURL=DefaultTable.js.map