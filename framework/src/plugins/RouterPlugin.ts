import { App } from '../App';
import { DuplicateGlobalIntentsError } from '../errors/DuplicateGlobalIntentsError';
import { Intent, IntentMap } from '../interfaces';
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

  install(parent: App): Promise<void> | void {
    parent.middlewareCollection.use('dialogue.router', this.setRoute);
  }

  initialize(parent: App): Promise<void> | void {
    return this.checkForDuplicateGlobalHandlers(parent);
  }

  private setRoute = async (jovo: Jovo) => {
    jovo.$input.intent = this.getMappedIntent(jovo.$input, jovo.$config.routing?.intentMap);
    jovo.$route = await new RoutingExecutor(jovo).execute();
  };

  private getMappedIntent(input: JovoInput, intentMap?: IntentMap): Intent | string | undefined {
    const intent = input.intent || input.nlu?.intent;
    if (!intent) return;
    const intentName = typeof intent === 'string' ? intent : intent.name;
    const mappedIntentName = intentMap?.[intentName] || intentName;
    return input.intent && typeof input.intent === 'object'
      ? { ...input.intent, name: mappedIntentName }
      : mappedIntentName;
  }

  private checkForDuplicateGlobalHandlers(app: App): Promise<void> {
    return new Promise((resolve, reject) => {
      const globalHandlerMap: Record<string, HandlerMetadata[]> = {};

      app.componentTree.forEach((node) => {
        const componentHandlerMetadata =
          MetadataStorage.getInstance().getMergedHandlerMetadataOfComponent(node.metadata.target);
        componentHandlerMetadata.forEach((handlerMetadata) => {
          handlerMetadata.globalIntentNames.forEach((globalIntentName) => {
            const mappedIntentName =
              app.config.routing?.intentMap?.[globalIntentName] || globalIntentName;
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
