import { App } from './App';
import {
  BaseComponent,
  ComponentConfig,
  ComponentConstructor,
  ComponentDeclaration,
} from './BaseComponent';
import { ComponentOptions } from './metadata/ComponentMetadata';
import { Plugin, PluginConfig } from './Plugin';

export interface ComponentPluginConfig<COMPONENT extends BaseComponent = BaseComponent>
  extends PluginConfig {
  component?: ComponentConfig<COMPONENT>;
}

export abstract class ComponentPlugin<
  COMPONENT extends BaseComponent = BaseComponent,
  CONFIG extends ComponentPluginConfig<COMPONENT> = ComponentPluginConfig<COMPONENT>
> extends Plugin<CONFIG> {
  abstract readonly component: ComponentConstructor<COMPONENT>;

  install(app: App): void {
    let options: ComponentOptions<COMPONENT> | undefined = undefined;

    if (this.config.component) {
      options = {
        config: this.config.component,
      };
    }

    app.useComponents(new ComponentDeclaration(this.component, options));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  mount(): void | Promise<void> {}
}
