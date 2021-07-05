import { App } from '../App';
import { DuplicateGlobalIntentsError } from '../errors/DuplicateGlobalIntentsError';
import { HandleRequest } from '../HandleRequest';
import { Jovo } from '../Jovo';
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

  install(app: App): Promise<void> | void {
    app.middlewareCollection.use('before.dialog.logic', this.setRoute);
  }

  initialize(parent: App): Promise<void> | void {
    return this.checkForDuplicateGlobalHandlers(parent);
  }

  private setRoute = async (handleRequest: HandleRequest, jovo: Jovo) => {
    // TODO determine order
    const intentName =
      jovo.$nlu.intent?.name ||
      jovo.$request.getIntentName() ||
      jovo.$request.getRequestType()?.type;
    if (!intentName) {
      // TODO determine what to do if no intent was passed (probably UNHANDLED)
      // in the future other data can be passed and used by the handler, but for now just use the intent-name
      return;
    }
    jovo.$route = await new RoutingExecutor(handleRequest, jovo).execute(intentName);
  };

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
