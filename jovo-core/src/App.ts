import _cloneDeep from 'lodash.clonedeep';
import _get from 'lodash.get';
import _set from 'lodash.set';
import { Extensible, ExtensibleConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { Plugin, PluginConfig } from './Plugin';

export interface AppConfig extends ExtensibleConfig {
  test: string;
}

export class App extends Extensible<AppConfig> {
  readonly config: AppConfig = {
    test: '',
  };

  getDefaultConfig(): AppConfig {
    return {
      plugin: {},
      test: '',
    };
  }

  async initialize(): Promise<void> {
    // TODO populate this.config from the loaded global configuration via file or require or similar
    return this.initializePlugins();
  }

  install(parent: Extensible): Promise<void> | void {
    return;
  }

  async handle() {
    const handleRequest = new HandleRequest(_cloneDeep(this.config));
    await this.installPlugins(handleRequest, handleRequest, this.plugins);

    handleRequest.config.test = 'edited';
    if (handleRequest.config.plugin?.Example) {
      handleRequest.config.plugin.Example.test = 'edited';
    }

    if (handleRequest.config.plugin?.CorePlatform) {
      handleRequest.config.plugin.CorePlatform.foo = 'edited';

      if (handleRequest.config.plugin.CorePlatform.plugin?.DialogflowNlu) {
        handleRequest.config.plugin.CorePlatform.plugin.DialogflowNlu.bar = 'edited';
      }
    }

    console.log('-'.repeat(50));
    console.log('App', JSON.stringify(this, undefined, 2));
    console.log('HandleRequest', JSON.stringify(handleRequest, undefined, 2));
  }

  private async installPlugins(
    handleRequest: HandleRequest,
    installTo: { plugins: Record<string, Plugin> },
    plugins: Record<string, Plugin>,
    path = 'plugin',
  ) {
    for (const key in plugins) {
      if (plugins.hasOwnProperty(key)) {
        const configPath = `${path}.${key}`;

        const appConfig = _get(this.config, configPath, {}) as PluginConfig;
        const config = _cloneDeep(appConfig);
        if (config.plugin) {
          config.plugin = {};
        }
        const pluginCopy = Object.create(plugins[key].constructor.prototype);
        Object.assign(pluginCopy, plugins[key], { config, plugins: {} });

        await pluginCopy.install(installTo === handleRequest ? this : installTo);

        installTo.plugins[key] = pluginCopy;
        _set(handleRequest.config, configPath, config);

        if (plugins[key] instanceof Extensible && (plugins[key] as Extensible).plugins) {
          await this.installPlugins(
            handleRequest,
            pluginCopy,
            (plugins[key] as Extensible).plugins,
            `${configPath}.plugin`,
          );
        }
      }
    }
  }
}
