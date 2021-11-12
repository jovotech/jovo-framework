import { App, Jovo, JovoError, Plugin, PluginConfig } from '@jovotech/framework';
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
        hint: 'You can find your api key on https://airtable.com/account',
        learnMore: 'https://www.jovo.tech/docs/cms/airtable#configuration',
      });
    }

    if (!this.config.baseId) {
      throw new JovoError({
        message: 'baseId has to bet set',
        hint: 'You can find your baseId on https://airtable.com/api',
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

      const records: Records<FieldSet> = await this.airtableBase(tableName)
        .select(table.config.selectOptions)
        .all();
      const values: unknown[][] = [];

      const keys: string[] =
        table.config.order ||
        table.config.selectOptions?.fields ||
        table.config.selectOptions?.sort?.map((el) => el.field) ||
        Object.keys(records.find((record) => Object.keys(record.fields).length)?.fields || []);

      if (!keys.length) {
        continue;
      }

      values.push(keys);

      for (const record of records) {
        const recordValues: unknown[] = [];

        for (const key of keys) {
          recordValues.push(record.fields[key]);
        }

        values.push(recordValues);
      }

      const parsed: unknown = table.parse(values, jovo);

      jovo.$cms[tableName] = parsed;
    }
  }
}
