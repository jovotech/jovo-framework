import { InputType, Intent } from '@jovotech/common';
import { App } from '../App';
import { DuplicateGlobalIntentsError } from '../errors/DuplicateGlobalIntentsError';
import { HandleRequest } from '../HandleRequest';
import { IntentMap } from '../interfaces';
import { Jovo } from '../Jovo';
import { JovoInput } from '../JovoInput';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { Plugin, PluginConfig } from '../Plugin';
import { RouteMatch } from './RouteMatch';
import { RoutingExecutor } from './RoutingExecutor';

export interface RouterPluginConfig extends PluginConfig {}

declare module '../Extensible' {
  interface ExtensiblePluginConfig {
    RouterPlugin?: RouterPluginConfig;
  }

  interface ExtensiblePlugins {
    RouterPlugin?: RouterPlugin;
  }
}

export interface JovoRoute {
  readonly resolved: RouteMatch;
  readonly matches: ReadonlyArray<RouteMatch>;
}

export class RouterPlugin extends Plugin<RouterPluginConfig> {
  getDefaultConfig(): PluginConfig {
    return {};
  }

  initialize(parent: App): Promise<void> | void {
    return this.checkForDuplicateGlobalHandlers(parent);
  }

  mount(parent: HandleRequest): Promise<void> | void {
    parent.middlewareCollection.use('dialogue.router', (jovo) => {
      return this.setRoute(jovo);
    });
  }

  private async setRoute(jovo: Jovo): Promise<void> {
    if (jovo.$input.type === InputType.Error) {
      return jovo.$app.handleError(
        new Error(jovo.$input.getText() || 'Input is of type ERROR'),
        jovo,
      );
    }

    // merge global intent map with intent map of currently used platform
    const mergedIntentMap = {
      ...(jovo.$config.routing?.intentMap || {}),
      ...(jovo.$platform.config.intentMap || {}),
    };

    const mappedIntent = this.getMappedIntent(jovo.$input, mergedIntentMap);
    if (mappedIntent) {
      jovo.$input.intent = mappedIntent;
    }
    jovo.$route = await new RoutingExecutor(jovo).execute();
  }

  private getMappedIntent(input: JovoInput, intentMap?: IntentMap): Intent | string | undefined {
    const intent = input.intent || input.nlu?.intent;
    if (!intent) return;
    const intentName = typeof intent === 'string' ? intent : intent.name;
    const mappedIntentName = intentMap?.[intentName];
    if (!mappedIntentName) return;
    return input.intent && typeof input.intent === 'object'
      ? { ...input.intent, name: mappedIntentName }
      : mappedIntentName;
  }

  private checkForDuplicateGlobalHandlers(app: App): Promise<void> {
    return new Promise((resolve, reject) => {
      const globalHandlerMap: Record<string, HandlerMetadata[]> = {};

      // make an intent map out of all the intent maps of all platforms
      const platformIntentMap = app.platforms.reduce((intentMap: IntentMap, platform) => {
        return { ...intentMap, ...(platform.config.intentMap || {}) };
      }, {});
      // merge the global intent map with the intent map created by all platforms
      const mergedIntentMap = { ...(app.config.routing?.intentMap || {}), ...platformIntentMap };

      app.componentTree.forEach((node) => {
        const componentHandlerMetadata =
          MetadataStorage.getInstance().getMergedHandlerMetadataOfComponent(node.metadata.target);
        componentHandlerMetadata.forEach((handlerMetadata) => {
          handlerMetadata.globalIntentNames.forEach((globalIntentName) => {
            const mappedIntentName = mergedIntentMap?.[globalIntentName] || globalIntentName;
            if (!globalHandlerMap[mappedIntentName]) {
              globalHandlerMap[mappedIntentName] = [];
            }
            if (!handlerMetadata.hasCondition) {
              globalHandlerMap[mappedIntentName].push(handlerMetadata);
            }
          });
        });
      });

      const duplicateHandlerEntries = Object.entries(globalHandlerMap).filter(
        ([, handlers]) => handlers.length > 1,
      );
      if (duplicateHandlerEntries.length) {
        return reject(new DuplicateGlobalIntentsError(duplicateHandlerEntries));
      }
      return resolve();
    });
  }
}
