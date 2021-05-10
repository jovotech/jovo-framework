import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { GoogleCliConfig } from '../../dist/cli/utils';

export class Plugin extends JovoCliPlugin {
  readonly $id: string = 'testPlugin';
  readonly $type: PluginType = 'platform';
  readonly $config!: GoogleCliConfig;
  readonly platformDirectory: string = 'test';

  getPlatformPath(): string {
    return '';
  }

  getDefaultConfig(): GoogleCliConfig {
    return {};
  }
}
