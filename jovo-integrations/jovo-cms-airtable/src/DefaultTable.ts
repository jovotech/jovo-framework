import { ErrorCode, Extensible, HandleRequest, JovoError, Plugin, PluginConfig } from 'jovo-core';
import _merge = require('lodash.merge');
import { AirtableCMS } from './AirtableCMS';

export interface AirtableTable extends PluginConfig {
  caching?: boolean;
  name?: string;
  order?: string[]; // correct order of columns, i.e. index 0 should be first column of table
  table?: string;
  type?: string;
  selectOptions?: {
    // documentation for selectOptions here: https://v3.jovo.tech/docs/cms/airtable#configuration
    fields?: string[];
    filterByFormula?: string;
    maxRecords?: number;
    sort?: object[];
    view?: string;
  };
}

export class DefaultTable implements Plugin {
  config: AirtableTable = {
    caching: true,
    enabled: true,
    order: [],
    selectOptions: {
      view: 'Grid view',
    },
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

    this.config.table = this.config.table || this.config.name;

    if (this.cms.config.caching === false || this.config.caching === false) {
      this.cms.baseApp.middleware('request').use(this.retrieve.bind(this));
    }
  }

  async retrieve(handleRequest: HandleRequest) {
    if (!this.cms) {
      return Promise.reject(
        new JovoError(
          'no cms initialized',
          ErrorCode.ERR_PLUGIN,
          'jovo-cms-airtable',
          `The cms object wasn't initialized at the time the plugin tried to retrieve the data.`,
        ),
      );
    }
    if (!this.config.table) {
      return Promise.reject(
        new JovoError(
          'table has to be set',
          ErrorCode.ERR_PLUGIN,
          'jovo-cms-airtable',
          'The table name has to be defined in your config.js file',
          undefined,
          'https://v3.jovo.tech/docs/cms/airtable#configuration',
        ),
      );
    }
    if (!this.config.name) {
      return Promise.reject(
        new JovoError(
          'name has to be set',
          ErrorCode.ERR_PLUGIN,
          'jovo-cms-airtable',
          `The sheet's name has to be defined in your config.js file`,
          undefined,
          'https://v3.jovo.tech/docs/cms/airtable#configuration',
        ),
      );
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

  parse(handleRequest: HandleRequest, values: {}) {
    // tslint:disable-line
    handleRequest.app.$cms[this.config.name!] = values;
  }
}
