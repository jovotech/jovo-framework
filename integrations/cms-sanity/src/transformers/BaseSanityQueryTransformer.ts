import { Jovo, Plugin, PluginConfig } from '@jovotech/framework';

export interface SanityQueryTransformerConfig extends PluginConfig {
  query: string;
}

export abstract class BaseSanityQueryTransformer<
  CONFIG extends SanityQueryTransformerConfig = SanityQueryTransformerConfig,
> extends Plugin<CONFIG> {
  abstract execute(values: unknown | unknown[], jovo: Jovo): unknown | unknown[];
}
