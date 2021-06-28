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

    const componentNode = handleRequest.componentTree.getNodeAtOrFail(jovo.$route.path);
    const componentPath = componentNode.path.join('.');

    if (!jovo.$session.$state) {
      jovo.$session.$state = [
        {
          componentPath,
        },
      ];
    } else {
      const currentStateStackItem = jovo.$session.$state[jovo.$session.$state.length - 1];
      // TODO has to checked in complex use-cases
      // if the component path is a different one, omit every custom component data (resolve, config, $data)
      if (componentPath !== currentStateStackItem.componentPath) {
        jovo.$session.$state[jovo.$session.$state.length - 1] = {
          componentPath,
        };
      }
    }

    await componentNode.executeHandler({
      jovo,
      handlerKey: jovo.$route.handlerKey,
      updateRoute: false,
    });
  };
}
