import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { GoogleCliConfig } from '../../src/cli/utilities';

export class Plugin extends JovoCliPlugin {
  readonly id: string = 'testPlugin';
  readonly type: PluginType = 'platform';
  readonly config!: GoogleCliConfig;
  readonly platformDirectory: string = 'test';

  get platformPath(): string {
    return '';
  }

  get name(): string {
    return '';
  }

  getDefaultConfig(): GoogleCliConfig {
    return { projectId: '', resourcesDirectory: '' };
  }
}
