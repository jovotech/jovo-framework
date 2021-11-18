import { ErrorCode, HandleRequest, JovoError } from 'jovo-core';
import _merge = require('lodash.merge');
import _set = require('lodash.set');

import { AirtableTable, DefaultTable } from './DefaultTable';

export interface Config extends AirtableTable {}

export class ObjectArrayTable extends DefaultTable {
  config: Config = {
    enabled: true,
    selectOptions: {
      view: 'Grid view',
    },
  };

  constructor(config?: Config) {
    super(config);
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  parse(handleRequest: HandleRequest, values: any[]) {
    // tslint:disable-line
    const name = this.config.name;

    if (!name) {
      throw new JovoError(
        'name has to be set',
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-airtable',
        `The sheet's name has to be defined in your config.js file`,
        undefined,
        'https://v3.jovo.tech/docs/cms/airtable#configuration',
      );
    }

    const resultArray = [];
    const keys = values[0];
    for (let i = 1; i < values.length; i++) {
      const row: string[] = values[i];
      const obj = {};

      for (let j = 0; j < row.length; j++) {
        const cell: string = row[j];
        _set(obj, `${keys[j]}`, cell);
      }
      resultArray.push(obj);
    }

    handleRequest.app.$cms[name] = resultArray;
  }
}
