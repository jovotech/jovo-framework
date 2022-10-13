import { HandleRequest, PluginConfig, StateStackItem } from '../index';
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
  getDefaultConfig(): PluginConfig {
    return {};
  }

  mount(parent: HandleRequest): Promise<void> | void {
    parent.middlewareCollection.use('dialogue.logic', (jovo) => {
      return this.handle(jovo);
    });
  }

  private async handle(jovo: Jovo): Promise<void> {
    if (!jovo.$route) {
      return;
    }
    // get the node at the resolved route-path
    const componentNode = jovo.$handleRequest.componentTree.getNodeAtOrFail(
      jovo.$route.resolved.path,
    );
    // update the state-stack if the component is not global
    if (!componentNode.metadata.isGlobal) {
      const stackItem: StateStackItem = {
        component: componentNode.path.join('.'),
      };
      // if no state-stack exists, initialize it and add the new item
      if (!jovo.$session.state?.length) {
        jovo.$session.state = [stackItem];
      } else {
        if (jovo.$route.resolved.stackIndex !== undefined) {
          jovo.$session.state.splice(jovo.$route.resolved.stackIndex + 1);
        }
        const currentStateStackItem = jovo.$session.state[jovo.$session.state.length - 1];
        // if the component path is a different one, omit every custom component data (resolve, config, $data)
        if (stackItem.component !== currentStateStackItem.component) {
          jovo.$session.state[jovo.$session.state.length - 1] = stackItem;
        }
      }
    }
    // update the active component node in handleRequest to keep track of the state
    jovo.$handleRequest.activeComponentNode = componentNode;
    // execute the component's handler
    await componentNode.executeHandler({
      jovo,
      handler: jovo.$route.resolved.handler,
    });
  }
}
