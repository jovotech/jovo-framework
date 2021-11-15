import _set from 'lodash.set';
import { AirtableTable, AirtableTableConfig } from './AirtableTable';

export class ObjectArrayTable extends AirtableTable {
  getDefaultConfig(): AirtableTableConfig {
    return { range: 'A:Z' };
  }

  parse(values: Array<string | string[]>[]): Record<string, unknown>[] {
    const resources: Record<string, unknown>[] = [];
    const headers: string[] = values.shift() as string[];

    for (const row of values) {
      const object = {};
      for (let i = 0; i < headers.length; i++) {
        _set(object, headers[i], row[i]);
      }
      resources.push(object);
    }

    return resources;
  }
}
