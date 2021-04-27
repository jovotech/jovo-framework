import { BaseComponent, ComponentPlugin, ComponentPluginConfig, PluginConfig } from '../../src';

export class EmptyComponent extends BaseComponent {}

export interface ExampleComponentConfig extends PluginConfig {
  text: string;
}

export class ExampleComponent extends BaseComponent<ExampleComponentConfig> {
  getDefaultConfig() {
    return {
      text: 'default',
    };
  }
}

export interface ExampleComponentPluginConfig extends ComponentPluginConfig<ExampleComponent> {}

export class ExampleComponentPlugin extends ComponentPlugin<
  ExampleComponent,
  ExampleComponentPluginConfig
> {
  readonly component = ExampleComponent;

  getDefaultConfig(): ExampleComponentPluginConfig {
    return {};
  }
}
