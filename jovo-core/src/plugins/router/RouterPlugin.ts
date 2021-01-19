import { App } from '../../App';
import { Plugin, PluginConfig } from '../../Plugin';

export interface RouterPluginConfig extends PluginConfig {}

declare module '../../Extensible' {
  interface ExtensiblePluginConfig {
    RouterPlugin?: RouterPluginConfig;
  }

  interface ExtensiblePlugins {
    RouterPlugin?: RouterPlugin;
  }
}

export class RouterPlugin extends Plugin<RouterPluginConfig> {
  getDefaultConfig() {
    return {};
  }

  mount(parent: App): Promise<void> | void {
    return;
  }
}
