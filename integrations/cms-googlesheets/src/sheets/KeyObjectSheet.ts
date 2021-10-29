import { Jovo } from '@jovotech/framework';
import _set from 'lodash.set';
import { GoogleSheetsCmsSheet, GoogleSheetsCmsSheetConfig } from './GoogleSheetsCmsSheet';

export class KeyObjectSheet extends GoogleSheetsCmsSheet {
  getDefaultConfig(): GoogleSheetsCmsSheetConfig {
    return { range: 'A:Z' };
  }

  parse(_jovo: Jovo, values: Array<string | string[]>[]): unknown {
    const resources = {};
    const headers: string[] = values.shift() as string[];

    for (const row of values) {
      const key: string = row[0] as string;

      for (let i = 1; i < headers.length; i++) {
        const cell: string = row[i] as string;

        _set(resources, `${key}.${headers[i]}`, cell);
      }
    }

    return resources;
  }
}
