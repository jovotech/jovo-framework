import _get from 'lodash.get';
import _merge from 'lodash.merge';
import _set from 'lodash.set';
import { Extensible, ExtensibleConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { DeepPartial } from './index';
import { Plugin, PluginConstructor, PluginDefinition, PluginDefinitionInput } from './Plugin';

export interface AppConfig extends ExtensibleConfig {
  test: string;
}

export class App extends Extensible<AppConfig> {
  readonly config: AppConfig = {
    test: '',
  };

  private pluginDefinitions: PluginDefinitionInput[] = [];

  constructor(config?: AppConfig) {
    super({});
    if (config) {
      _merge(this.config, config);
    }
  }

  getDefaultConfig(): AppConfig {
    return {
      plugin: {},
      test: '',
    };
  }

  async initialize(): Promise<void> {
    return this.initializePlugins(this.pluginDefinitions, this);
  }

  install(parent: Extensible): Promise<void> | void {
    return;
  }

  // eslint-disable-next-line @typescript-eslint/ban-types
  use<C extends object = object, T extends Plugin<C> = Plugin<C>>(
    constructor: PluginConstructor<C, T>,
    configOrPlugins?: DeepPartial<C> | PluginDefinitionInput[],
    plugins?: PluginDefinitionInput[],
  ) {
    if (
      (!configOrPlugins || typeof configOrPlugins !== 'object' || Array.isArray(configOrPlugins)) &&
      plugins
    ) {
      throw new Error('Second parameter has to be an object when passing a third parameter.');
    }
    const config =
      configOrPlugins && typeof configOrPlugins === 'object' && !Array.isArray(configOrPlugins)
        ? configOrPlugins
        : undefined;
    plugins =
      configOrPlugins && typeof configOrPlugins === 'object' && Array.isArray(configOrPlugins)
        ? configOrPlugins
        : plugins;

    this.pluginDefinitions.push({
      constructor,
      config,
      plugins,
    });
  }

  async handle() {
    // deep copy config
    // TODO: refactor: this removes functions which should not happen
    const handleRequest = new HandleRequest(JSON.parse(JSON.stringify(this.config)));
    await this.installPlugins(handleRequest, handleRequest, this.plugins);

    // handleRequest.config.test = 'edited';
    // if (handleRequest.config.plugin?.Example) {
    //   handleRequest.config.plugin.Example.test = 'edited';
    // }
    //
    // if (handleRequest.config.plugin?.CorePlatform) {
    //   handleRequest.config.plugin.CorePlatform.foo = 'edited';
    //
    //   if (handleRequest.config.plugin.CorePlatform.plugin?.DialogflowNlu) {
    //     handleRequest.config.plugin.CorePlatform.plugin.DialogflowNlu.bar = 'edited';
    //   }
    // }

    console.log('App', JSON.stringify(this, undefined, 2));
    console.log('HandleRequest', JSON.stringify(handleRequest, undefined, 2));
  }

  private async initializePlugins(
    definitions: Array<PluginConstructor | PluginDefinition>,
    parent: Extensible,
    path = 'plugin',
  ) {
    for (let i = 0, len = definitions.length; i < len; i++) {
      if (typeof definitions[i] === 'function') {
        const name = (definitions[i] as PluginConstructor).name;
        const config = parent.config.plugin?.[name] || {};
        const instance = new (definitions[i] as PluginConstructor)(config);
        if (instance.initialize) {
          await instance.initialize(parent);
        }
        parent.plugins[name] = instance;
        _set(this.config, `${path}.${name}`, config);
      } else {
        const { constructor, plugins, config } = definitions[i] as PluginDefinition;
        const requiredConfig = config || parent.config.plugin?.[constructor.name] || {};
        const instance = new constructor(requiredConfig);
        if (instance.initialize) {
          await instance.initialize(parent);
        }
        parent.plugins[constructor.name] = instance;
        _set(this.config, `${path}.${constructor.name}`, requiredConfig);
        if (plugins?.length && instance instanceof Extensible) {
          await this.initializePlugins(plugins, instance, `${path}.${constructor.name}.plugin`);
        }
      }
    }
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

        const appConfig = _get(this.config, configPath, {});
        // TODO replace with deep copy
        const config = { ...appConfig };
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
