import { ErrorCode, HandleRequest, JovoError } from 'jovo-core';
import _merge = require('lodash.merge');
import _set = require('lodash.set');

import { DefaultSheet, GoogleSheetsSheet } from './DefaultSheet';

export interface Config extends GoogleSheetsSheet {}

export class ObjectArraySheet extends DefaultSheet {
  config: Config = {
    enabled: true,
    name: undefined,
    range: 'A:Z',
  };

  constructor(config?: Config) {
    super(config);
    if (config) {
      this.config = _merge(this.config, config);
    }
  }

  parse(handleRequest: HandleRequest, values: any[]) {
    // tslint:disable-line
    const entity = this.config.entity || this.config.name;

    if (!entity) {
      throw new JovoError(
        'entity has to be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-googlesheets',
        `The sheet's name has to be defined in your config.js file.`,
        undefined,
        'https://v3.jovo.tech/docs/cms/google-sheets#configuration',
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

    handleRequest.app.$cms[entity] = resultArray;
  }
}
