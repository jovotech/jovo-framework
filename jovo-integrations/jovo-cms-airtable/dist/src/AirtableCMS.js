"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const DefaultTable_1 = require("./DefaultTable");
const KeyValueTable_1 = require("./KeyValueTable");
const ObjectArrayTable_1 = require("./ObjectArrayTable");
const ResponsesTable_1 = require("./ResponsesTable");
const Airtable = require("airtable");
class AirtableCMS extends jovo_core_1.BaseCmsPlugin {
    constructor(config) {
        super(config);
        this.config = {
            apiKey: undefined,
            baseId: undefined,
            caching: true,
            enabled: true,
            tables: [],
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.actionSet = new jovo_core_1.ActionSet(['retrieve'], this);
    }
    install(app) {
        super.install(app);
        this.baseApp = app;
        app.middleware('setup').use(this.retrieveAirtableData.bind(this));
        const defaultTableMap = {
            // tslint:disable-line
            default: DefaultTable_1.DefaultTable,
            keyvalue: KeyValueTable_1.KeyValueTable,
            objectarray: ObjectArrayTable_1.ObjectArrayTable,
            responses: ResponsesTable_1.ResponsesTable,
        };
        if (this.config.tables) {
            this.config.tables.forEach((table) => {
                let type;
                if (!table.type) {
                    type = 'Default';
                }
                if (table.type && defaultTableMap[table.type.toLowerCase()]) {
                    type = table.type.toLowerCase();
                }
                if (type) {
                    this.use(new defaultTableMap[type.toLowerCase()](table));
                }
            });
        }
        if (!this.config.apiKey) {
            throw new jovo_core_1.JovoError(`Can't find api key`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-airtable', 'To use the Airtable integration you have to provide a valid api key', 'You can find your api key on https://airtable.com/api');
        }
        if (!this.config.baseId) {
            throw new jovo_core_1.JovoError(`Can't find baseId`, jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-airtable', 'To use the Airtable integrations you have to provide a baseId', 'You can find your baseId on https://airtable.com/api');
        }
        this.base = new Airtable({ apiKey: this.config.apiKey }).base(this.config.baseId);
    }
    async loadTableData(loadOptions) {
        return new Promise((resolve, reject) => {
            const arr = [];
            this.base(loadOptions.table)
                .select(loadOptions.selectOptions)
                .eachPage((records, fetchNextPage) => {
                /**
                 * This function (`page`) will get called for each page of records.
                 * records is an array of objects where the keys are the first row of the table and the values are the current rows values.
                 * The primary field of the table is at the last spot of the object, besides that the object has the same order as the table itself
                 * To maintain the same structure as the jovo-cms-googlesheets integration, the data will be converted to an array of arrays
                 */
                // push keys first as that's the first row of the table
                const record = _get(records[0], 'fields');
                const keys = loadOptions.order || Object.keys(record);
                if (!arr.length) {
                    arr.push(keys);
                }
                records.forEach((r) => {
                    // push each records values
                    const values = [];
                    /**
                     * Airtable doesn't parse key & value of a cell without a value
                     * Replace missing key/value pairs with empty strings
                     */
                    keys.forEach((key) => {
                        const value = r.fields[key] || '';
                        values.push(value);
                    });
                    arr.push(values);
                });
                // To fetch the next page of records, call `fetchNextPage`.
                // If there are more records, `page` will get called again.
                // If there are no more records, `done` will get called.
                fetchNextPage();
            }, (err) => {
                if (err) {
                    return reject(new jovo_core_1.JovoError(err.message, err.name, 'jovo-cms-airtable'));
                }
                return resolve(arr);
            });
        });
    }
    async retrieveAirtableData(handleRequest) {
        await this.middleware('retrieve').run(handleRequest, true);
    }
    shiftLastItemToFirstIndex(arr) {
        // tslint:disable-line
        const lastItem = arr.pop();
        arr.unshift(lastItem);
        return arr;
    }
}
exports.AirtableCMS = AirtableCMS;
//# sourceMappingURL=AirtableCMS.js.map