import { PluginConfig, Plugin, Extensible } from '@jovotech/framework';

interface FileDbConfig extends PluginConfig {
  pathToFile?: string;
}
export class FileDb extends Plugin<FileDbConfig> {
  constructor(config: FileDbConfig) {
    // @ts-ignore
    super(config);
  }

  getDefaultConfig(): FileDbConfig {
    return {};
  }

  mount(parent: Extensible): Promise<void> | void {
    //
  }
}
