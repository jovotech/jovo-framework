import { HandleRequest } from '../HandleRequest';
import { DeepPartial, ExtensibleConfig } from '../index';
import { Jovo } from '../Jovo';
import { Plugin } from '../Plugin';

export interface HandlerPluginConfig extends ExtensibleConfig {}

declare module '../Extensible' {
  interface ExtensiblePluginConfig {
    HandlerPlugin?: HandlerPluginConfig;
  }

  interface ExtensiblePlugins {
    HandlerPlugin?: HandlerPlugin;
  }
}

export class HandlerPlugin extends Plugin<HandlerPluginConfig> {
  constructor(config?: DeepPartial<HandlerPluginConfig>) {
    super(config);
  }

  getDefaultConfig() {
    return {};
  }

  mount(handleRequest: HandleRequest): Promise<void> | void {
    handleRequest.middlewareCollection.use('dialog.logic', this.handle);
    return undefined;
  }

  private handle = async (handleRequest: HandleRequest, jovo: Jovo) => {
    if (!jovo.$route || !jovo.$route?.path?.length) {
      // TODO error-handling or determine what to do in general
      return;
    }
    const componentMetadata = jovo.$getComponentMetadataOrFail(jovo.$route.path);
    await jovo.$runComponentHandler(componentMetadata, jovo.$route.handlerKey);
  };
}
