import { RegisteredComponents } from '../BaseComponent';
import { InternalIntent } from '../enums';
import { HandleRequest } from '../HandleRequest';
import { Jovo } from '../Jovo';
import { ComponentMetadata } from '../metadata/ComponentMetadata';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { findAsync } from '../utilities';
import { JovoRoute } from './RouterPlugin';

export interface RouteMatch {
  path: string[];
  metadata: HandlerMetadata;
  subState?: string;
}

export class RoutingExecutor {
  constructor(readonly handleRequest: HandleRequest, readonly jovo: Jovo) {}

  async execute(intentName: string): Promise<JovoRoute | undefined> {
    if (!intentName.length) {
      return;
    }
    const routeMatches = this.getRouteMatches(intentName);

    if (routeMatches.length) {
      const match = await this.findMatchingRoute(routeMatches);
      if (match) {
        return {
          path: match.path,
          handlerKey: match.metadata.propertyKey,
          subState: match.subState,
        };
      }
    }
    return;
  }

  private getRouteMatches(intentName: string): RouteMatch[] {
    let routeMatches: RouteMatch[] = [];
    if (!this.jovo.$state) {
      routeMatches = this.getGlobalRouteMatches(intentName);
      if (!routeMatches.length) {
        routeMatches = this.getGlobalRouteMatches(InternalIntent.Unhandled);
      }
    } else {
      const latestStateStackItem = this.jovo.$state[this.jovo.$state.length - 1];
      const currentPath = latestStateStackItem.componentPath.split('.');

      let relatedHandlerMetadata: HandlerMetadata[] = [];
      while (!relatedHandlerMetadata.length && currentPath.length) {
        const relatedComponentMetadata = this.jovo.$getComponentMetadataOrFail(currentPath);
        relatedHandlerMetadata = this.getMatchingHandlerMetadata(
          relatedComponentMetadata,
          intentName,
        );
        if (currentPath.length && !relatedHandlerMetadata.length) {
          currentPath.splice(currentPath.length - 1);
        }
      }
      if (relatedHandlerMetadata.length) {
        routeMatches = relatedHandlerMetadata.map((metadata) => ({
          path: currentPath,
          metadata,
        }));
      } else {
        routeMatches = this.getGlobalRouteMatches(intentName);
        if (!routeMatches.length) {
          routeMatches = this.getGlobalRouteMatches(InternalIntent.Unhandled);
        }
      }
    }
    return routeMatches;
  }

  private getMatchingHandlerMetadata(
    componentMetadata: ComponentMetadata,
    intentName: string,
    subState?: string,
  ): HandlerMetadata[] {
    let relatedHandlerMetadata = MetadataStorage.getInstance()
      .getMergedHandlerMetadataOfComponent(componentMetadata.target)
      .filter(
        (metadata) =>
          (subState ? metadata.options?.subState === subState : !metadata.options?.subState) &&
          metadata.intents.includes(intentName) &&
          (!metadata.options?.platforms?.length ||
            metadata.options?.platforms?.includes(this.jovo.$platform.constructor.name)),
      );
    if (!relatedHandlerMetadata.length) {
      relatedHandlerMetadata = MetadataStorage.getInstance()
        .getMergedHandlerMetadataOfComponent(componentMetadata.target)
        .filter(
          (metadata) =>
            (subState ? metadata.options?.subState === subState : !metadata.options?.subState) &&
            metadata.intents.includes(InternalIntent.Unhandled) &&
            (!metadata.options?.platforms?.length ||
              metadata.options?.platforms?.includes(this.jovo.$platform.constructor.name)),
        );
    }
    // if nothing was found and subState is set, look in the same component without subState
    if (!relatedHandlerMetadata.length && subState) {
      relatedHandlerMetadata = this.getMatchingHandlerMetadata(componentMetadata, intentName);
    }
    return relatedHandlerMetadata;
  }

  private getGlobalRouteMatches(intentName: string): RouteMatch[] {
    return this.collectGlobalRouteMatchesOfComponents(this.handleRequest.components, intentName);
  }

  private collectGlobalRouteMatchesOfComponents(
    components: RegisteredComponents,
    intentName: string,
    path: string[] = [],
    matches: RouteMatch[] = [],
  ): RouteMatch[] {
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
              metadata.options?.platforms?.includes(this.jovo.$platform.constructor.name)),
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
        this.collectGlobalRouteMatchesOfComponents(
          component.components,
          intentName,
          [...path],
          matches,
        );
      }
    }

    return matches;
  }

  // TODO determine order, refactor then
  private async findMatchingRoute(matches: RouteMatch[]): Promise<RouteMatch | undefined> {
    const conditionalMatches = matches.filter(({ metadata }) => metadata.options?.if);
    const unconditionalMatches = matches.filter(({ metadata }) => !metadata.options?.if);
    let relatedMatch = await findAsync(
      conditionalMatches,
      async ({ metadata }) =>
        (metadata.options?.platforms?.length &&
          (await metadata.options?.if?.(this.handleRequest, this.jovo))) ||
        false,
    );
    if (!relatedMatch) {
      relatedMatch = await findAsync(
        conditionalMatches,
        async ({ metadata }) =>
          (!metadata.options?.platforms?.length &&
            (await metadata.options?.if?.(this.handleRequest, this.jovo))) ||
          false,
      );
    }
    if (!relatedMatch) {
      relatedMatch = unconditionalMatches.find(
        ({ metadata }) => metadata.options?.platforms?.length,
      );
    }
    if (!relatedMatch) {
      relatedMatch = unconditionalMatches.find(
        ({ metadata }) => !metadata.options?.platforms?.length,
      );
    }
    return relatedMatch;
  }
}
