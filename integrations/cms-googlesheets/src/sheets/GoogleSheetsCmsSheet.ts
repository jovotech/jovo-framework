import { Jovo, Plugin, PluginConfig } from '@jovotech/framework';

export interface GoogleSheetsCmsSheetConfig extends PluginConfig {
  range: string;
  spreadsheetId?: string;
  caching?: boolean;
}
export abstract class GoogleSheetsCmsSheet<
  CONFIG extends GoogleSheetsCmsSheetConfig = GoogleSheetsCmsSheetConfig,
> extends Plugin<CONFIG> {
  abstract parse(values: unknown[][], jovo?: Jovo): unknown;
}
