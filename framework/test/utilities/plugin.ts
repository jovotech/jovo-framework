import { Plugin, PluginConfig } from '../../src';

export class EmptyPlugin extends Plugin {
  getDefaultConfig(): PluginConfig {
    return {};
  }
}

export interface ExamplePluginConfig extends PluginConfig {
  text: string;
}

declare module '../../src' {
  interface ExtensiblePluginConfig {
    ExamplePlugin?: ExamplePluginConfig;
  }
}

export class ExamplePlugin extends Plugin<ExamplePluginConfig> {
  getDefaultConfig(): ExamplePluginConfig {
    return {
      text: 'default',
    };
  }
}
