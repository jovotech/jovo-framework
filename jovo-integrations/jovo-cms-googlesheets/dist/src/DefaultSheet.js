"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
class DefaultSheet {
    constructor(config) {
        this.config = {
            caching: true,
            enabled: true,
            name: undefined,
            range: 'A:B',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.config.entity = this.config.entity || this.config.name;
    }
    install(extensible) {
        this.cms = extensible;
        extensible.middleware('retrieve').use(this.retrieve.bind(this));
        if (this.cms.config.caching === false || this.config.caching === false) {
            this.cms.baseApp.middleware('request').use(this.retrieve.bind(this));
        }
    }
    async retrieve(handleRequest) {
        if (!this.cms) {
            return Promise.reject('No cms initialized.');
        }
        const spreadsheetId = this.config.spreadsheetId || this.cms.config.spreadsheetId;
        if (!spreadsheetId) {
            return Promise.reject(new jovo_core_1.JovoError('spreadsheetId has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', 'the spreadsheetId has to be defined in your config.js file', undefined, 'https://www.jovo.tech/docs/cms/google-sheets#configuration'));
        }
        if (!this.config.name) {
            return Promise.reject(new jovo_core_1.JovoError('sheet name has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', 'the sheet name has to be defined in your config.js file', undefined, 'https://www.jovo.tech/docs/cms/google-sheets#configuration'));
        }
        if (!this.config.range) {
            return Promise.reject(new jovo_core_1.JovoError('range has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', 'the range has to be defined in your config.js file', undefined, 'https://www.jovo.tech/docs/cms/google-sheets#configuration'));
        }
        let values = []; // tslint:disable-line
        const access = this.config.access || this.cms.config.access || 'private';
        if (access === 'private') {
            jovo_core_1.Log.verbose('Retrieving private spreadsheet');
            jovo_core_1.Log.verbose('Spreadsheet ID: ' + spreadsheetId);
            jovo_core_1.Log.verbose('Sheet name: ' + this.config.name);
            jovo_core_1.Log.verbose('Sheet range: ' + this.config.range);
            values = await this.cms.loadPrivateSpreadsheetData(spreadsheetId, this.config.name, this.config.range); // tslint:disable-line
        }
        else if (access === 'public') {
            jovo_core_1.Log.verbose('Retrieving public spreadsheet');
            jovo_core_1.Log.verbose('Spreadsheet ID: ' + spreadsheetId);
            jovo_core_1.Log.verbose('Sheet position: ' + this.config.position);
            const publicValues = await this.cms.loadPublicSpreadsheetData(spreadsheetId, this.config.position); // tslint:disable-line
            values = this.parsePublicToPrivate(publicValues);
        }
        if (values) {
            this.parse(handleRequest, values);
        }
    }
    parse(handleRequest, values) {
        // tslint:disable-line
        if (!this.config.entity) {
            throw new jovo_core_1.JovoError('entity has to be set.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', `The sheet's name has to be defined in your config.js file.`, undefined, 'https://www.jovo.tech/docs/cms/google-sheets#configuration');
        }
        handleRequest.app.$cms[this.config.entity] = values;
    }
    /**
     * Parses public spreadsheet json to a private spreadsheet format
     * @param values
     * @returns {any[]}
     */
    parsePublicToPrivate(values) {
        // tslint:disable-line
        const newValues = []; // tslint:disable-line
        const entries = values.feed.entry;
        const headers = [];
        if (!entries) {
            throw new jovo_core_1.JovoError('No spreadsheet values found.', jovo_core_1.ErrorCode.ERR_PLUGIN, 'jovo-cms-googlesheets', 'It seems like your spreadsheet is empty or without values.');
        }
        entries.forEach((entry, index) => {
            // tslint:disable-line
            const row = [];
            // get headers
            if (index === 0) {
                Object.keys(entry).forEach((key) => {
                    if (key.startsWith('gsx$')) {
                        headers.push(key.substr(4));
                    }
                });
                newValues.push(headers);
            }
            // get values
            Object.keys(entry).forEach((key) => {
                if (key.startsWith('gsx$')) {
                    const cell = entry[key];
                    row.push(cell['$t']); // tslint:disable-line:no-string-literal
                }
            });
            newValues.push(row);
        });
        return newValues;
    }
}
exports.DefaultSheet = DefaultSheet;
//# sourceMappingURL=DefaultSheet.js.map