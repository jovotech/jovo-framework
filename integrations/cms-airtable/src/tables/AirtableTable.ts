import { Jovo, Plugin, PluginConfig, UnknownObject } from '@jovotech/framework';
import { QueryParams } from 'airtable/lib/query_params';

export interface AirtableTableConfig extends PluginConfig {
  caching?: boolean;
  /* Correct order of columns, i.e. index 0 should be the first column of table */
  order?: string[];
  /* Documentation for selectOptions here: https://www.jovo.tech/docs/cms/airtable#configuration */
  selectOptions?: QueryParams<UnknownObject>;
}

export abstract class AirtableTable<
  CONFIG extends AirtableTableConfig = AirtableTableConfig,
> extends Plugin<CONFIG> {
  abstract parse(values: unknown[][], jovo?: Jovo): unknown;
}
