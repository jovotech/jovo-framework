import { PluginConfig, Plugin, Extensible } from '@jovotech/core';

export interface FileDbConfig extends PluginConfig {
  pathToFile?: string;
}
export class FileDb extends Plugin<FileDbConfig> {
  getDefaultConfig(): FileDbConfig {
    return {};
  }

  mount(parent: Extensible): Promise<void> | void {
    //
  }
}
