import { Jovo } from '@jovotech/framework';
import _set from 'lodash.set';
import { GoogleSheetsCmsSheet, GoogleSheetsCmsSheetConfig } from './GoogleSheetsCmsSheet';

export class KeyValueSheet extends GoogleSheetsCmsSheet {
  getDefaultConfig(): GoogleSheetsCmsSheetConfig {
    return { range: 'A:B' };
  }

  parse(values: unknown[][]): unknown {
    const resources = {};
    values.shift();

    for (const row of values) {
      const key: string = row.shift() as string;

      for (const cell of row) {
        _set(resources, key, cell);
      }
    }

    return resources;
  }
}
