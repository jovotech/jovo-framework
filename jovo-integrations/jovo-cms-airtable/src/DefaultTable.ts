import {Extensible, JovoError, HandleRequest, PluginConfig, Plugin, Log, ErrorCode} from "jovo-core";
import {AirtableCMS} from "./AirtableCMS";
import _merge = require('lodash.merge');

export interface AirtableTable extends PluginConfig {
    name?: string;
    type?: string;
    table?: string;
    selectOptions: {
        // documentation for selectOptions here: https://www.jovo.tech/docs/cms/airtable#configuration
        fields?: string[];
        filterByFormula?: string;
        maxRecords?: number;
        sort?: object[]; 
        view?: string;
    };
}

export class DefaultTable implements Plugin {
    config: AirtableTable = {
        enabled: true,
        selectOptions: {
            view: 'Grid view'
        }
    };

    cms?: AirtableCMS;

    constructor(config?: AirtableTable) {
        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    install(extensible: Extensible) {
        this.cms = extensible as AirtableCMS;
        extensible.middleware('retrieve')!.use(this.retrieve.bind(this));
    }

    uninstall(cms: Extensible) {

    }

    async retrieve(handleRequest: HandleRequest) {        
        if (!this.cms) {
            return Promise.reject(new JovoError(
                'no cms initialized',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'The cms object wasn\'t initialized at the time the plugin tried to retrieve the data.'
            ));
        }
        if (!this.config.table) {
            return Promise.reject(new JovoError(
                'table has to be set',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'The table name has to be defined in your config.js file',
                undefined,
                'https://www.jovo.tech/docs/cms/airtable#configuration'
            ));
        }
        if (!this.config.name) {
            return Promise.reject(new JovoError(
                'name has to be set',
                ErrorCode.ERR_PLUGIN,
                'jovo-cms-airtable',
                'The sheet\'s name has to be defined in your config.js file',
                undefined,
                'https://www.jovo.tech/docs/cms/airtable#configuration'
            ));
        }

        const values = await this.cms.loadTableData(this.config.selectOptions, this.config.table);
        
        if (values) {
            this.parse(handleRequest, values);
        }
    }

    parse(handleRequest: HandleRequest, values: {}) { // tslint:disable-line
        handleRequest.app.$cms[this.config.name!] = values;
    }
}