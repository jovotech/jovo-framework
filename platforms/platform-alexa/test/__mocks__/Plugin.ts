import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { AlexaCliConfig } from '../../dist/cli/utils';

export class Plugin extends JovoCliPlugin {
  readonly $id: string = 'testPlugin';
  readonly $type: PluginType = 'platform';
  readonly $config!: AlexaCliConfig;
  readonly platformDirectory: string = 'test';

  getPlatformPath(): string {
    return '';
  }

  getDefaultConfig(): AlexaCliConfig {
    return {};
  }

  getSkillPackagePath(): string {
    return '';
  }

  getSkillJsonPath(): string {
    return '';
  }

  getModelsPath(): string {
    return '';
  }

  getModelPath(): string {
    return '';
  }

  getAccountLinkingPath(): string {
    return '';
  }

  getAskConfigFolderPath(): string {
    return '';
  }

  getAskConfigPath(): string {
    return '';
  }
}
