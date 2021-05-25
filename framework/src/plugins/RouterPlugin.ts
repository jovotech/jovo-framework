import { App } from '../App';
import { BaseComponent } from '../BaseComponent';
import { MatchingRouteNotFoundError } from '../errors/MatchingRouteNotFoundError';
import { HandleRequest } from '../HandleRequest';
import { Jovo } from '../Jovo';
import { Plugin, PluginConfig } from '../Plugin';
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
  path: string[];
  handlerKey: keyof BaseComponent | string;
  subState?: string;
}

export class RouterPlugin extends Plugin<RouterPluginConfig> {
  getDefaultConfig() {
    return {};
  }

  install(app: App): Promise<void> | void {
    app.middlewareCollection.use('before.dialog.logic', this.setRoute);
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
    const route = await new RoutingExecutor(handleRequest, jovo).execute(intentName);
    if (!route) {
      throw new MatchingRouteNotFoundError(intentName, jovo.$state, jovo.$request);
    }
    jovo.$route = route;
    const componentPath = jovo.$route.path.join('.');
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
  };
}
