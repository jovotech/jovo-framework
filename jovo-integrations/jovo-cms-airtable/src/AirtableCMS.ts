import {
  ActionSet,
  BaseApp,
  BaseCmsPlugin,
  ErrorCode,
  ExtensibleConfig,
  HandleRequest,
  JovoError,
} from 'jovo-core';
import _get = require('lodash.get');
import _merge = require('lodash.merge');

import { AirtableTable, DefaultTable } from './DefaultTable';
import { KeyValueTable } from './KeyValueTable';
import { ObjectArrayTable } from './ObjectArrayTable';
import { ResponsesTable } from './ResponsesTable';

import * as Airtable from 'airtable';

export interface Config extends ExtensibleConfig {
  apiKey?: string;
  baseId?: string;
  tables?: AirtableTable[];
  caching?: boolean;
}

export class AirtableCMS extends BaseCmsPlugin {
  config: Config = {
    apiKey: undefined,
    baseId: undefined,
    caching: true,
    enabled: true,
    tables: [],
  };
  base!: Airtable.Base;
  baseApp: any; // tslint:disable-line

  constructor(config?: Config) {
    super(config);

    if (config) {
      this.config = _merge(this.config, config);
    }
    this.actionSet = new ActionSet(['retrieve'], this);
  }

  install(app: BaseApp) {
    super.install(app);
    this.baseApp = app;
    app.middleware('setup')!.use(this.retrieveAirtableData.bind(this));

    const defaultTableMap: { [key: string]: any } = {
      // tslint:disable-line
      default: DefaultTable,
      keyvalue: KeyValueTable,
      objectarray: ObjectArrayTable,
      responses: ResponsesTable,
    };

    if (this.config.tables) {
      this.config.tables.forEach((table: AirtableTable) => {
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
      throw new JovoError(
        `Can't find api key`,
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-airtable',
        'To use the Airtable integration you have to provide a valid api key',
        'You can find your api key on https://airtable.com/api',
      );
    }
    if (!this.config.baseId) {
      throw new JovoError(
        `Can't find baseId`,
        ErrorCode.ERR_PLUGIN,
        'jovo-cms-airtable',
        'To use the Airtable integrations you have to provide a baseId',
        'You can find your baseId on https://airtable.com/api',
      );
    }

    this.base = new Airtable({ apiKey: this.config.apiKey }).base(this.config.baseId);
  }

  async loadTableData(loadOptions: LoadOptions): Promise<{}> {
    return new Promise((resolve, reject) => {
      const arr: any[] = [];

      this.base(loadOptions.table)
        .select(loadOptions.selectOptions!)
        .eachPage(
          (records: any[], fetchNextPage: () => void) => {
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

            records.forEach((r: any) => {
              // push each records values
              const values: string[] = [];
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
          },
          (err: Error) => {
            if (err) {
              return reject(new JovoError(err.message, err.name, 'jovo-cms-airtable'));
            }
            return resolve(arr);
          },
        );
    });
  }

  private async retrieveAirtableData(handleRequest: HandleRequest) {
    await this.middleware('retrieve')!.run(handleRequest, true);
  }

  private shiftLastItemToFirstIndex(arr: any[]) {
    // tslint:disable-line
    const lastItem = arr.pop();
    arr.unshift(lastItem);
    return arr;
  }
}

interface LoadOptions {
  table: string;
  order?: string[];
  selectOptions?: {
    // documentation for selectOptions here: https://v3.jovo.tech/docs/cms/airtable#configuration
    fields?: string[];
    filterByFormula?: string;
    maxRecords?: number;
    sort?: object[];
    view?: string;
  };
}
