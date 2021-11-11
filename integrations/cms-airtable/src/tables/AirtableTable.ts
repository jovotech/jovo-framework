import { Jovo, Plugin, PluginConfig, UnknownObject } from '@jovotech/framework';
import { QueryParams } from 'airtable/lib/query_params';

export interface AirtableTableConfig extends PluginConfig {
  caching?: boolean;
  order?: string[];
  // Documentation for selectOptions here: https://www.jovo.tech/docs/cms/airtable#configuration
  selectOptions?: Omit<
    QueryParams<UnknownObject>,
    'pageSize' | 'maxRecords' | 'view' | 'cellFormat' | 'timeZone' | 'userLocale' | 'offset'
  >;
}

export abstract class AirtableTable<
  CONFIG extends AirtableTableConfig = AirtableTableConfig,
> extends Plugin<CONFIG> {
  abstract parse(values: unknown[][], jovo?: Jovo): unknown;
}
