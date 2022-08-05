import { TtsData } from './TtsData';
import { Plugin, PluginConfig } from '../Plugin';

export interface TtsCachePluginConfig extends PluginConfig {
  returnEncodedAudio: boolean;
}

export abstract class TtsCachePlugin<
  CONFIG extends TtsCachePluginConfig = TtsCachePluginConfig,
> extends Plugin<CONFIG> {
  abstract getItem(
    key: string,
    locale: string,
    fileExtension: string,
  ): Promise<TtsData | undefined>;
  abstract storeItem(key: string, locale: string, data: TtsData): Promise<string | undefined>;
}
