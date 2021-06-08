import { HandleRequest } from '../HandleRequest';
import { App, PluginConfig } from '../index';
import { Jovo } from '../Jovo';
import { Plugin } from '../Plugin';

export interface HandlerPluginConfig extends PluginConfig {}

declare module '../Extensible' {
  interface ExtensiblePluginConfig {
    HandlerPlugin?: HandlerPluginConfig;
  }

  interface ExtensiblePlugins {
    HandlerPlugin?: HandlerPlugin;
  }
}

export class HandlerPlugin extends Plugin<HandlerPluginConfig> {
  getDefaultConfig() {
    return {};
  }

  install(app: App): Promise<void> | void {
    app.middlewareCollection.use('dialog.logic', this.handle);
  }

  private handle = async (handleRequest: HandleRequest, jovo: Jovo) => {
    if (!jovo.$route || !jovo.$route?.path?.length) {
      // TODO error-handling or determine what to do in general
      return;
    }
    const componentMetadata = jovo.$getComponentMetadataOrFail(jovo.$route.path);
    await jovo.$runComponentHandler(componentMetadata, jovo.$route.handlerKey, false);
  };
}
