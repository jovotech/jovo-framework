import { App } from './App';
import { BaseComponent, ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { Plugin, PluginConfig } from './Plugin';

export interface ComponentPluginConfig<COMPONENT extends BaseComponent = BaseComponent>
  extends PluginConfig {
  component?: COMPONENT['config'];
}

export abstract class ComponentPlugin<
  COMPONENT extends BaseComponent = BaseComponent,
  CONFIG extends ComponentPluginConfig<COMPONENT> = ComponentPluginConfig<COMPONENT>
> extends Plugin<CONFIG> {
  abstract readonly component: ComponentConstructor<COMPONENT>;

  install(app: App): void {
    app.useComponents(
      new ComponentDeclaration(this.component, {
        config: this.config.component,
      }),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mount(): void | Promise<void> {}
}
