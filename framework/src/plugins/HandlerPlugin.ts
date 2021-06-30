import { HandleRequest } from '../HandleRequest';
import { App, PluginConfig, StateStackItem } from '../index';
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
    if (!jovo.$route) {
      return;
    }
    // get the node at the resolved route-path
    const componentNode = handleRequest.componentTree.getNodeAtOrFail(jovo.$route.resolved.path);
    // update the state-stack if the component is not global
    if (!componentNode.metadata.isGlobal) {
      const stackItem: StateStackItem = {
        componentPath: componentNode.path.join('.'),
      };
      // if no state-stack exists, initialize it and add the new item
      if (!jovo.$session.$state?.length) {
        jovo.$session.$state = [stackItem];
      } else {
        const currentStateStackItem = jovo.$session.$state[jovo.$session.$state.length - 1];
        // if the component path is a different one, omit every custom component data (resolve, config, $data)
        if (stackItem.componentPath !== currentStateStackItem.componentPath) {
          jovo.$session.$state[jovo.$session.$state.length - 1] = stackItem;
        }
      }
    }
    // update the active component node in handleRequest to keep track of the state
    handleRequest.$activeComponentNode = componentNode;
    // execute the component's handler
    await componentNode.executeHandler({
      jovo,
      handlerKey: jovo.$route.resolved.handler,
    });
  };
}
