import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { PluginConfigGoogle } from '../../dist/cli/utils';

export class Plugin extends JovoCliPlugin {
  readonly $id: string = 'testPlugin';
  readonly $type: PluginType = 'platform';
  readonly platformDirectory: string = 'test';

  getPlatformPath(): string {
    return '';
  }

  getDefaultConfig(): PluginConfigGoogle {
    return {};
  }
}
