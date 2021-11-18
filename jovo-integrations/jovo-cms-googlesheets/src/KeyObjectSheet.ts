import { ErrorCode, HandleRequest, JovoError } from 'jovo-core';
import _merge = require('lodash.merge');
import _set = require('lodash.set');

import { DefaultSheet, GoogleSheetsSheet } from './DefaultSheet';

export interface Config extends GoogleSheetsSheet {}

export class KeyObjectSheet extends DefaultSheet {
  config: Config = {
    enabled: true,
    range: 'A:C',
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
