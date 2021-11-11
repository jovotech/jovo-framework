import { JovoCliPlugin, PluginType } from '@jovotech/cli-core';
import { AlexaCliConfig } from '../../src/cli/utilities';

export class Plugin extends JovoCliPlugin {
  readonly id: string = 'testPlugin';
  readonly type: PluginType = 'platform';
  readonly config!: AlexaCliConfig;
  readonly platformDirectory: string = 'test';

  get name(): string {
    return '';
  }

  get platformPath(): string {
    return '';
  }

  get defaultConfig(): AlexaCliConfig {
    return {};
  }

  get skillPackagePath(): string {
    return '';
  }

  get skillJsonPath(): string {
    return '';
  }

  get modelsPath(): string {
    return '';
  }

  get modelPath(): string {
    return '';
  }

  get accountLinkingPath(): string {
    return '';
  }

  get askConfigFolderPath(): string {
    return '';
  }

  get askConfigPath(): string {
    return '';
  }

  get askResourcesPath(): string {
    return '';
  }

  getModelPath(): string {
    return '';
  }
}
