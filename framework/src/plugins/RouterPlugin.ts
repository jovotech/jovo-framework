import { BaseComponent, RegisteredComponents } from '../BaseComponent';
import { InternalIntent } from '../enums';
import { MatchingRouteNotFoundError } from '../errors/MatchingRouteNotFoundError';
import { HandleRequest } from '../HandleRequest';
import { Jovo } from '../Jovo';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { Plugin, PluginConfig } from '../Plugin';
import { findAsync } from '../utilities';

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

export interface RouteMatch {
  path: string[];
  metadata: HandlerMetadata;
}

export class RouterPlugin extends Plugin<RouterPluginConfig> {
  getDefaultConfig() {
    return {};
  }

  mount(handleRequest: HandleRequest): Promise<void> | void {
    handleRequest.middlewareCollection.use('before.dialog.logic', this.setRoute);
    return;
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

    // console.log('Components', inspect(handleRequest.components, { depth: 2, compact: true }));
    // console.log('State', inspect(jovo.$state, { depth: 2, compact: true }));

    let subState = undefined;
    let routeMatches: RouteMatch[] = [];
    if (!jovo.$state) {
      // try to find intent in global handlers
      routeMatches = await this.getGlobalRouteMatches(intentName, handleRequest, jovo);
      if (!routeMatches.length) {
        // if none were found, try to find a global Unhandled-handler
        routeMatches = await this.getGlobalRouteMatches(
          InternalIntent.Unhandled,
          handleRequest,
          jovo,
        );
      }
    } else {
      // get the related component and find the related handler within
      const latestStateStackItem = jovo.$state[jovo.$state.length - 1];
      subState = latestStateStackItem.$subState;
      const relatedComponentMetadata = jovo.$getComponentMetadataOrFail(
        latestStateStackItem.componentPath.split('.'),
      );
      const relatedHandlerMetadata = MetadataStorage.getInstance()
        .getMergedHandlerMetadataOfComponent(relatedComponentMetadata.target)
        .filter(
          (metadata) =>
            (latestStateStackItem.$subState
              ? metadata.options?.subState === latestStateStackItem.$subState
              : !metadata.options?.subState) &&
            metadata.intents.includes(intentName) &&
            (!metadata.options?.platforms?.length ||
              metadata.options?.platforms?.includes(jovo.$platform.constructor.name)),
        );

      if (relatedHandlerMetadata.length) {
        routeMatches.push(
          ...relatedHandlerMetadata.map((metadata) => ({
            path: latestStateStackItem.componentPath.split('.'),
            metadata,
          })),
        );
      }
    }

    // console.log('Matches', inspect(routeMatches, { depth: 2, compact: true }));

    if (routeMatches.length) {
      const match = await this.findRouteMatch(routeMatches, handleRequest, jovo);
      // console.log('Match', inspect(match, { depth: 2, compact: true }));

      if (match) {
        jovo.$route = {
          path: match.path,
          handlerKey: match.metadata.propertyKey,
          subState,
        };
      }
    }
    // console.log('Route', jovo.$route);

    if (!jovo.$route) {
      throw new MatchingRouteNotFoundError(intentName, jovo.$state, jovo.$request);
    }

    if (!jovo.$state) {
      jovo.$session.$state = [
        {
          componentPath: jovo.$route.path.join('.'),
        },
      ];
    }
  };

  private async getGlobalRouteMatches(
    intentName: string,
    handleRequest: HandleRequest,
    jovo: Jovo,
  ): Promise<RouteMatch[]> {
    return this.collectGlobalRouteMatchesOfComponents(handleRequest.components, intentName, jovo);
  }

  private async collectGlobalRouteMatchesOfComponents(
    components: RegisteredComponents,
    intentName: string,
    jovo: Jovo,
    path: string[] = [],
    matches: RouteMatch[] = [],
  ): Promise<RouteMatch[]> {
    const componentNames = Object.keys(components);
    for (let i = 0, len = componentNames.length; i < len; i++) {
      const component = components[componentNames[i]];
      if (!component) continue;
      path.push(componentNames[i]);
      // TODO: determine if matching by intent-name and platforms should be done here, will have to be reworked as soon as more input-types are supported
      const relatedHandlerMetadata = MetadataStorage.getInstance()
        .getMergedHandlerMetadataOfComponent(component.target)
        .filter(
          (metadata) =>
            metadata.globalIntentNames.includes(intentName) &&
            (!metadata.options?.platforms?.length ||
              metadata.options?.platforms?.includes(jovo.$platform.constructor.name)),
        );
      if (relatedHandlerMetadata.length) {
        matches.push(
          ...relatedHandlerMetadata.map((metadata) => ({
            path: [...path],
            metadata,
          })),
        );
      }
      if (component.components) {
        await this.collectGlobalRouteMatchesOfComponents(
          component.components,
          intentName,
          jovo,
          [...path],
          matches,
        );
      }
    }

    return matches;
  }

  // TODO determine order, refactor then
  private async findRouteMatch(
    matches: RouteMatch[],
    handleRequest: HandleRequest,
    jovo: Jovo,
  ): Promise<RouteMatch | undefined> {
    const conditionalMatches = matches.filter(({ metadata }) => metadata.options?.if);
    const unconditionalMatches = matches.filter(({ metadata }) => !metadata.options?.if);

    let relatedMatch = await findAsync(
      conditionalMatches,
      ({ metadata }) =>
        (metadata.options?.platforms?.length && metadata.options?.if?.(handleRequest, jovo)) ||
        false,
    );
    // console.log('conditional platform', { relatedMatch });

    if (!relatedMatch) {
      relatedMatch = await findAsync(
        conditionalMatches,
        ({ metadata }) =>
          (!metadata.options?.platforms?.length && metadata.options?.if?.(handleRequest, jovo)) ||
          false,
      );
      // console.log('conditional', { relatedMatch });
    }

    if (!relatedMatch) {
      relatedMatch = unconditionalMatches.find(
        ({ metadata }) => metadata.options?.platforms?.length,
      );
      // console.log('platform', { relatedMatch });
    }

    if (!relatedMatch) {
      relatedMatch = unconditionalMatches.find(
        ({ metadata }) => !metadata.options?.platforms?.length,
      );
      // console.log('generic', { relatedMatch });
    }
    return relatedMatch;
  }
}
