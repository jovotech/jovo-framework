import { InternalIntent } from '../enums';
import { HandleRequest } from '../HandleRequest';
import { Jovo } from '../Jovo';
import { StateStack } from '../JovoSession';
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
  private convertHandlerMetadataToRouteMatch = (path: string[]) => (metadata: HandlerMetadata) => ({
    path,
    metadata,
    subState: metadata.options?.subState,
  });

  constructor(readonly handleRequest: HandleRequest, readonly jovo: Jovo) {}

  async execute(intentName: string): Promise<JovoRoute | undefined> {
    if (!intentName.length) {
      return;
    }
    const routeMatches = this.getRouteMatches(intentName);
    if (!routeMatches.length) {
      return;
    }
    const match = await this.findMatchingRoute(routeMatches);
    if (!match) {
      return;
    }
    return {
      path: match.path,
      handlerKey: match.metadata.propertyKey,
      subState: match.subState,
    };
  }

  getRouteMatches(intentName: string): RouteMatch[] {
    if (!this.jovo.$state) {
      return this.getGlobalRouteMatches(intentName);
    }
    let routeMatches = this.getRouteMatchesInState(intentName, this.jovo.$state);
    if (!routeMatches.length) {
      routeMatches = this.getGlobalRouteMatches(intentName);
    }
    return routeMatches;
  }

  // TODO determine order, refactor then
  async findMatchingRoute(matches: RouteMatch[]): Promise<RouteMatch | undefined> {
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

  private getGlobalInputFilteredHandlerMetadata(
    componentMetadata: ComponentMetadata,
    intentName: string,
  ): HandlerMetadata[] {
    return MetadataStorage.getInstance()
      .getMergedHandlerMetadataOfComponent(componentMetadata.target)
      .filter(
        (metadata) =>
          this.getMappedIntentNames(
            componentMetadata.isGlobal ? metadata.intentNames : metadata.globalIntentNames,
            intentName,
          ).includes(intentName) &&
          (!metadata.options?.platforms?.length ||
            metadata.options?.platforms?.includes(this.jovo.$platform.constructor.name)),
      );
  }

  private getGlobalRouteMatches(intentName: string): RouteMatch[] {
    let routeMatches = this.collectGlobalRouteMatches(intentName);
    if (!routeMatches.length) {
      routeMatches = this.collectGlobalRouteMatches(InternalIntent.Unhandled);
    }
    return routeMatches;
  }

  private collectGlobalRouteMatches(intentName: string): RouteMatch[] {
    const matches: RouteMatch[] = [];
    this.handleRequest.componentTree.forEach((node) => {
      const relatedHandlerMetadata = this.getGlobalInputFilteredHandlerMetadata(
        node.metadata,
        intentName,
      );
      if (relatedHandlerMetadata.length) {
        matches.push(
          ...relatedHandlerMetadata.map(this.convertHandlerMetadataToRouteMatch(node.path)),
        );
      }
    });
    return matches;
  }

  private getInputFilteredHandlerMetadata(
    componentMetadata: ComponentMetadata,
    intentName: string,
    subState?: string,
  ): HandlerMetadata[] {
    return MetadataStorage.getInstance()
      .getMergedHandlerMetadataOfComponent(componentMetadata.target)
      .filter(
        (metadata) =>
          (subState ? metadata.options?.subState === subState : !metadata.options?.subState) &&
          this.getMappedIntentNames(metadata.intentNames, intentName).includes(intentName) &&
          (!metadata.options?.platforms?.length ||
            metadata.options?.platforms?.includes(this.jovo.$platform.constructor.name)),
      );
  }

  private getRouteMatchesInState(intentName: string, state: StateStack): RouteMatch[] {
    const latestStateStackItem = state[state.length - 1];
    const currentPath = latestStateStackItem.componentPath.split('.');

    let relatedHandlerMetadata: HandlerMetadata[] = [];
    while (!relatedHandlerMetadata.length && currentPath.length) {
      const relatedComponentNode = this.handleRequest.componentTree.getNodeAtOrFail(currentPath);
      relatedHandlerMetadata = this.getMatchingHandlerMetadata(
        relatedComponentNode.metadata,
        intentName,
      );
      if (currentPath.length && !relatedHandlerMetadata.length) {
        currentPath.splice(currentPath.length - 1);
      }
    }
    return relatedHandlerMetadata.map(this.convertHandlerMetadataToRouteMatch(currentPath));
  }

  private getMatchingHandlerMetadata(
    componentMetadata: ComponentMetadata,
    intentName: string,
    subState?: string,
  ): HandlerMetadata[] {
    let relatedHandlerMetadata = this.getInputFilteredHandlerMetadata(
      componentMetadata,
      intentName,
      subState,
    );
    if (!relatedHandlerMetadata.length) {
      relatedHandlerMetadata = this.getInputFilteredHandlerMetadata(
        componentMetadata,
        InternalIntent.Unhandled,
        subState,
      );
    }
    // if nothing was found and subState is set, look in the same component without subState
    if (!relatedHandlerMetadata.length && subState) {
      relatedHandlerMetadata = this.getMatchingHandlerMetadata(componentMetadata, intentName);
    }
    return relatedHandlerMetadata;
  }

  private getMappedIntentNames(intents: string[], intentName: string): string[] {
    const mappedIntent = this.handleRequest.config.intentMap[intentName];
    return mappedIntent ? [mappedIntent, ...intents] : intents.slice();
  }
}
