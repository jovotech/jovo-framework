import _set from 'lodash.set';
import { AirtableTable, AirtableTableConfig } from './AirtableTable';

export class KeyValueTable extends AirtableTable {
  getDefaultConfig(): AirtableTableConfig {
    return {};
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
