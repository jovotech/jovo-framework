import {
  ErrorCode,
  Extensible,
  HandleRequest,
  JovoError,
  Log,
  Plugin,
  PluginConfig,
} from 'jovo-core';
import _merge = require('lodash.merge');
import { GoogleSheetsCMS } from './GoogleSheetsCMS';

export interface GoogleSheetsSheet extends PluginConfig {
  name?: string;
  range?: string;
  spreadsheetId?: string;
  type?: string;
  access?: string;
  entity?: string;
  position?: number;
  caching?: boolean;
}

export class DefaultSheet implements Plugin {
  config: GoogleSheetsSheet = {
    caching: true,
    enabled: true,
    name: undefined,
    range: 'A:B',
  };

  cms?: GoogleSheetsCMS;

  constructor(config?: GoogleSheetsSheet) {
    if (config) {
      this.config = _merge(this.config, config);
    }
    this.config.entity = this.config.entity || this.config.name;
  }

  install(extensible: Extensible) {
    this.cms = extensible as GoogleSheetsCMS;
    extensible.middleware('retrieve')!.use(this.retrieve.bind(this));

    if (this.cms.config.caching === false || this.config.caching === false) {
      this.cms.baseApp.middleware('request').use(this.retrieve.bind(this));
    }
  }

  async retrieve(handleRequest: HandleRequest) {
    if (!this.cms) {
      return Promise.reject('No cms initialized.');
    }
    const spreadsheetId = this.config.spreadsheetId || this.cms.config.spreadsheetId;

    if (!spreadsheetId) {
      return Promise.reject(
        new JovoError(
          'spreadsheetId has to be set.',
          ErrorCode.ERR_PLUGIN,
          'jovo-cms-googlesheets',
          'the spreadsheetId has to be defined in your config.js file',
          undefined,
          'https://www.jovo.tech/docs/cms/google-sheets#configuration',
        ),
      );
    }
    if (!this.config.name) {
      return Promise.reject(
        new JovoError(
          'sheet name has to be set.',
          ErrorCode.ERR_PLUGIN,
          'jovo-cms-googlesheets',
          'the sheet name has to be defined in your config.js file',
          undefined,
          'https://www.jovo.tech/docs/cms/google-sheets#configuration',
        ),
      );
    }
    if (!this.config.range) {
      return Promise.reject(
        new JovoError(
          'range has to be set.',
          ErrorCode.ERR_PLUGIN,
          'jovo-cms-googlesheets',
          'the range has to be defined in your config.js file',
          undefined,
          'https://www.jovo.tech/docs/cms/google-sheets#configuration',
        ),
      );
    }
    let values: any[] = []; // tslint:disable-line

    const access = this.config.access || this.cms.config.access || 'private';
    Log.verbose('Retrieving spreadsheet');
    Log.verbose('Spreadsheet ID: ' + spreadsheetId);
    Log.verbose('Sheet name: ' + this.config.name);
    Log.verbose('Sheet range: ' + this.config.range);

    values = await this.cms.loadPrivateSpreadsheetData(
      spreadsheetId,
      this.config.name,
      this.config.range,
    );
    if (values) {
      this.parse(handleRequest, values);
    }
  }

  parse(handleRequest: HandleRequest, values: any[]) {
    // tslint:disable-line
    if (!this.config.entity) {
      throw new JovoError(
        'entity has to be set.',
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-googlesheets',
        `The sheet's name has to be defined in your config.js file.`,
        undefined,
        'https://www.jovo.tech/docs/cms/google-sheets#configuration',
      );
    }
    handleRequest.app.$cms[this.config.entity] = values;
  }

  /**
   * Parses public spreadsheet json to a private spreadsheet format
   * @deprecated Google API v3 is deprecated
   * @param values
   * @returns {any[]}
   */
  private parsePublicToPrivate(values: any) {
    // tslint:disable-line
    const newValues: any[] = []; // tslint:disable-line
    const entries = values.feed.entry;
    const headers: string[] = [];

    if (!entries) {
      throw new JovoError(
        'No spreadsheet values found.',
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-googlesheets',
        'It seems like your spreadsheet is empty or without values.',
      );
    }

    entries.forEach((entry: any, index: number) => {
      // tslint:disable-line
      const row: string[] = [];
      // get headers
      if (index === 0) {
        Object.keys(entry).forEach((key: string) => {
          if (key.startsWith('gsx$')) {
            headers.push(key.substr(4));
          }
        });
        newValues.push(headers);
      }
      // get values
      Object.keys(entry).forEach((key: string) => {
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
