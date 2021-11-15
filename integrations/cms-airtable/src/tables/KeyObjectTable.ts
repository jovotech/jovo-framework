import _set from 'lodash.set';
import { AirtableTable, AirtableTableConfig } from './AirtableTable';

export class KeyObjectTable extends AirtableTable {
  getDefaultConfig(): AirtableTableConfig {
    return {};
  }

  parse(values: Array<string | string[]>[]): unknown {
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
