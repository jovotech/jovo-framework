import { ComponentTreeNode } from '../ComponentTreeNode';
import { BuiltInHandler } from '../enums';
import { MatchingRouteNotFoundError } from '../errors/MatchingRouteNotFoundError';
import { Jovo } from '../Jovo';
import { ComponentMetadata } from '../metadata/ComponentMetadata';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { RouteMatch } from './RouteMatch';
import { JovoRoute } from './RouterPlugin';

export class RoutingExecutor {
  constructor(readonly jovo: Jovo) {}

  async execute(): Promise<JovoRoute> {
    const rankedRouteMatches = await this.getRankedRouteMatches();
    if (!rankedRouteMatches.length) {
      throw new MatchingRouteNotFoundError({
        request: this.jovo.$request,
        input: this.jovo.$input,
        state: this.jovo.$state,
      });
    }

    this.setSkipForRouteMatches(rankedRouteMatches);

    const resolvedRouteMatch = await this.resolveRoute(rankedRouteMatches);
    if (!resolvedRouteMatch) {
      throw new MatchingRouteNotFoundError({
        request: this.jovo.$request,
        input: this.jovo.$input,
        state: this.jovo.$state,
        matches: rankedRouteMatches,
      });
    }
    return {
      resolved: resolvedRouteMatch,
      matches: rankedRouteMatches,
    };
  }

  async getRankedRouteMatches(): Promise<RouteMatch[]> {
    const globalRouteMatches = await this.getRankedGlobalRouteMatches();
    if (!this.jovo.$state?.length) {
      return globalRouteMatches;
    }
    const localRouteMatches = await this.getRankedLocalRouteMatches();
    return [...localRouteMatches, ...globalRouteMatches];
  }

  setSkipForRouteMatches(rankedRouteMatches: RouteMatch[]): void {
    const intentName = this.jovo.$input.getIntentName();
    const isIntentToSkipUnhandled =
      intentName &&
      this.jovo.$handleRequest.config.routing?.intentsToSkipUnhandled?.includes(intentName);
    // if the mapped intent is an intent that is supposed to skip UNHANDLED
    if (isIntentToSkipUnhandled) {
      // set skip: true for all UNHANDLED-matches
      rankedRouteMatches.forEach((match) => {
        if (match.type === BuiltInHandler.Unhandled) {
          match.skip = true;
        }
      });
    }

    // find the first RouteMatch that is UNHANDLED
    const firstRouteMatchIndexWithUnhandled = rankedRouteMatches.findIndex(
      (match) => match.type === BuiltInHandler.Unhandled,
    );
    // find index of the last RouteMatch that has prioritizedOverUnhandled in a reversed matches-array
    const lastReversedRouteMatchIndexWithPrioritizedOverUnhandled = rankedRouteMatches
      .slice()
      .reverse()
      .findIndex((match) => !!match.prioritizedOverUnhandled);
    // get the actual index in the non-reversed matches-array by subtracting the index from the length and 1 due to arrays starting with 0
    const lastRouteMatchIndexWithPrioritizedOverUnhandled =
      rankedRouteMatches.length - lastReversedRouteMatchIndexWithPrioritizedOverUnhandled - 1;

    // if no indexes were found or they're invalid, abort
    if (
      firstRouteMatchIndexWithUnhandled < 0 ||
      lastReversedRouteMatchIndexWithPrioritizedOverUnhandled < 0 ||
      lastRouteMatchIndexWithPrioritizedOverUnhandled < 0 ||
      lastRouteMatchIndexWithPrioritizedOverUnhandled < firstRouteMatchIndexWithUnhandled
    ) {
      return;
    }
    // iterate all RouteMatches between indexes and set skip: true for them
    for (
      let i = firstRouteMatchIndexWithUnhandled;
      i < lastRouteMatchIndexWithPrioritizedOverUnhandled;
      i++
    ) {
      rankedRouteMatches[i].skip = true;
    }
  }

  async resolveRoute(routeMatches: RouteMatch[]): Promise<RouteMatch | undefined> {
    // iterate all RouteMatches and return the first match that has no skip not set to true
    return routeMatches.find((match) => !match.skip);
  }

  private async getRankedGlobalRouteMatches(): Promise<RouteMatch[]> {
    const globalRouteMatches = await this.getGlobalRouteMatches();
    return globalRouteMatches.sort(this.compareRouteMatchRanking);
  }

  private isGlobalHandlerMatching(
    metadata: HandlerMetadata,
    componentMetadata: ComponentMetadata,
  ): boolean {
    if (metadata.options?.types?.includes(this.jovo.$input.type)) {
      return true;
    }
    const intentNames = componentMetadata.isGlobal
      ? metadata.intentNames
      : metadata.globalIntentNames;
    const intentName = this.jovo.$input.getIntentName();
    return (
      (intentName && intentNames.includes(intentName)) ||
      intentNames.includes(BuiltInHandler.Unhandled)
    );
  }

  private async getGlobalRouteMatches(): Promise<RouteMatch[]> {
    const routeMatches: RouteMatch[] = [];

    const componentNodes = Array.from(this.jovo.$handleRequest.componentTree);
    // iterate all trees in the ComponentTree, for of used due to async methods
    for (const node of componentNodes) {
      // create a map-callback for the given node's path
      const handlerMetadataToRouteMatchMapper = this.createHandlerMetadataToRouteMatchMapper(
        node.path,
      );
      const relatedHandlerMetadata =
        MetadataStorage.getInstance().getMergedHandlerMetadataOfComponent(node.metadata.target);
      for (const metadata of relatedHandlerMetadata) {
        // if the conditions are no fulfilled, do not add the handler
        if (
          !this.isGlobalHandlerMatching(metadata, node.metadata) ||
          !(await this.areHandlerConditionsFulfilled(metadata))
        ) {
          continue;
        }
        routeMatches.push(handlerMetadataToRouteMatchMapper(metadata));
      }
    }

    return routeMatches;
  }

  private async getRankedLocalRouteMatches(): Promise<RouteMatch[]> {
    const routeMatches = await this.getLocalRouteMatches();
    return routeMatches.sort((match, otherMatch) => {
      // if the path is different, ignore
      if (match.path !== otherMatch.path) {
        return 0;
      }
      return this.compareRouteMatchRanking(match, otherMatch);
    });
  }

  private isLocalHandlerMatching(metadata: HandlerMetadata, subState?: string): boolean {
    if (metadata.options?.types?.includes(this.jovo.$input.type)) {
      return true;
    }
    const intentName = this.jovo.$input.getIntentName();
    return (
      ((intentName && metadata.intentNames.includes(intentName)) ||
        metadata.intentNames.includes(BuiltInHandler.Unhandled)) &&
      (subState ? metadata.options?.subState === subState : !metadata.options?.subState)
    );
  }

  private async getLocalRouteMatches(): Promise<RouteMatch[]> {
    if (!this.jovo.$state?.length) {
      return [];
    }
    const routeMatches: RouteMatch[] = [];
    const latestStateStackItem = this.jovo.$state[this.jovo.$state.length - 1];
    const currentComponentPath = latestStateStackItem.component.split('.');
    let subState = latestStateStackItem.subState;

    // get the current node
    let node: ComponentTreeNode | undefined =
      this.jovo.$handleRequest.componentTree.getNodeAtOrFail(currentComponentPath);
    // loop all nodes and their parent's as long as root is reached
    while (node) {
      // create a map-callback for the given node's path
      const handlerMetadataToRouteMatchMapper = this.createHandlerMetadataToRouteMatchMapper(
        node.path,
      );
      const relatedHandlerMetadata =
        MetadataStorage.getInstance().getMergedHandlerMetadataOfComponent(node.metadata.target);

      for (const metadata of relatedHandlerMetadata) {
        // if the conditions are no fulfilled, do not add the handler
        if (
          !this.isLocalHandlerMatching(metadata, subState) ||
          !(await this.areHandlerConditionsFulfilled(metadata))
        ) {
          continue;
        }
        routeMatches.push(handlerMetadataToRouteMatchMapper(metadata));
      }

      // if a subState is set, make sure to check the same node without subState before moving to the parent
      if (subState) {
        subState = undefined;
      } else {
        node = node.parent;
      }
    }
    return routeMatches;
  }

  private async areHandlerConditionsFulfilled(metadata: HandlerMetadata): Promise<boolean> {
    const isPlatformSupported =
      !metadata.options?.platforms?.length ||
      metadata.options?.platforms?.includes(this.jovo.$platform.constructor.name);
    const isConditionFulfilled = !metadata.options?.if || (await metadata.options?.if?.(this.jovo));
    return isPlatformSupported && isConditionFulfilled;
  }

  private createHandlerMetadataToRouteMatchMapper(
    path: string[],
  ): (metadata: HandlerMetadata) => RouteMatch {
    return (metadata) => {
      return new RouteMatch(metadata, path);
    };
  }

  private compareRouteMatchRanking(match: RouteMatch, otherMatch: RouteMatch): number {
    const matchIsUnhandled = match.metadata.intentNames.includes(BuiltInHandler.Unhandled);
    const otherMatchIsUnhandled = otherMatch.metadata.intentNames.includes(
      BuiltInHandler.Unhandled,
    );
    if (matchIsUnhandled && !otherMatchIsUnhandled) {
      return 1;
    } else if (!matchIsUnhandled && otherMatchIsUnhandled) {
      return -1;
    }

    return otherMatch.score - match.score;
  }
}
