import {
  App,
  Jovo,
  JovoError,
  JovoUser,
  Plugin,
  PluginConfig,
  UnknownObject,
} from '@jovotech/framework';
import Airtable, { FieldSet, Records } from 'airtable';
import { AirtableBase } from 'airtable/lib/airtable_base';
import { AirtableTable } from './tables';

export interface AirtableCmsConfig extends PluginConfig {
  apiKey: string;
  baseId: string;
  caching?: boolean;
  tables: Record<string, AirtableTable>;
}

export class AirtableCms extends Plugin<AirtableCmsConfig> {
  airtableBase!: AirtableBase;

  getDefaultConfig(): AirtableCmsConfig {
    return {
      apiKey: '',
      baseId: '',
      tables: {},
    };
  }

  install(app: App): void {
    app.middlewareCollection.use('request.start', this.retrieveAirtableData.bind(this));

    if (!this.config.apiKey) {
      throw new JovoError({
        message: 'apiKey has to be set',
        hint: 'To use the Airtable integration you have to provide a valid api key',
        learnMore: 'https://www.jovo.tech/docs/cms/airtable#configuration',
      });
    }

    if (!this.config.baseId) {
      throw new JovoError({
        message: 'baseId has to bet set',
        hint: 'To use the Airtable integrations you have to provide a baseId',
        learnMore: 'https://www.jovo.tech/docs/cms/airtable#configuration',
      });
    }

    this.airtableBase = new Airtable({ apiKey: this.config.apiKey }).base(this.config.baseId);
  }

  async retrieveAirtableData(jovo: Jovo): Promise<void> {
    for (const [tableName, table] of Object.entries(this.config.tables)) {
      // Cache cms data, if not configured otherwise
      if (
        (this.config.caching !== false || table.config.caching !== false) &&
        jovo.$cms[tableName]
      ) {
        continue;
      }

      // TODO: What if view is not table but other view (kanban)
      // TODO Test differnet data types
      const records: Records<FieldSet> = await this.airtableBase(tableName)
        .select(table.config.selectOptions)
        .all();
      const values: unknown[][] = [];

      const keys: string[] = table.config.selectOptions?.fields || Object.keys(records[0].fields);
      values.push(keys);

      for (const record of records) {
        const recordValues: unknown[] = [];

        for (const key of keys) {
          recordValues.push(record.fields[key]);
        }

        values.push(recordValues);
      }

      const parsed: unknown = table.parse(values);

      jovo.$cms[tableName] = parsed;
      console.log(jovo.$cms);
    }
  }
}
