import { ComponentTreeNode } from '../ComponentTree';
import { InternalIntent } from '../enums';
import { HandleRequest } from '../HandleRequest';
import { Jovo } from '../Jovo';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';
import { filterAsync } from '../utilities';
import { JovoRoute } from './RouterPlugin';

// export interface RouteMatch {
//   path: string[];
//   metadata: HandlerMetadata;
//   score?: number;
//   subState?: string;
// }

export class RouteMatch {
  constructor(readonly metadata: HandlerMetadata, readonly path: string[]) {}

  get component(): string {
    return this.path.join('.');
  }

  get handler(): string {
    return this.metadata.propertyKey;
  }

  // TODO: experimental, determine
  get score(): number {
    let score = 0;
    if (this.metadata.options?.if) {
      score += 1.5;
    }
    if (this.metadata.options?.platforms) {
      score += 1;
    }
    return score;
  }

  get subState(): string | undefined {
    return this.metadata.options?.subState;
  }

  get global(): boolean | undefined {
    return this.metadata.options?.global;
  }

  toJSON() {
    return {
      component: this.component,
      handler: this.handler,
      subState: this.subState,
      global: this.global,
      score: this.score,
    };
  }
}

export class RoutingExecutor {
  constructor(readonly handleRequest: HandleRequest, readonly jovo: Jovo) {}

  async execute(mappedIntentName: string): Promise<JovoRoute | undefined> {
    if (!mappedIntentName.length) {
      return;
    }
    const routeMatches = await this.getRouteMatches(mappedIntentName);
    if (!routeMatches.length) {
      return;
    }
    const rankedRouteMatches = this.rankRouteMatches(routeMatches);
    const match = await this.resolveRoute(rankedRouteMatches);
    if (!match) {
      return;
    }
    // TODO set correct values
    return {
      resolved: routeMatches[0],
      matches: routeMatches,
    };
  }

  async getRouteMatches(intentName: string): Promise<RouteMatch[]> {
    const globalRouteMatches = await this.getGlobalRouteMatches(intentName);
    if (!this.jovo.$state?.length) {
      return globalRouteMatches;
    }
    const localRouteMatches = await this.getLocalRouteMatches(intentName);
    return [...localRouteMatches, ...globalRouteMatches];
  }

  rankRouteMatches(routeMatches: RouteMatch[]): RouteMatch[] {
    // TODO: implement
    return routeMatches;
  }

  async resolveRoute(routeMatches: RouteMatch[]): Promise<RouteMatch | undefined> {
    // TODO: implement
    return;
  }

  private async getGlobalRouteMatches(intentName: string): Promise<RouteMatch[]> {
    const routeMatches: RouteMatch[] = [];

    const componentNodes = Array.from(this.handleRequest.componentTree);
    for (const node of componentNodes) {
      const handlerMetadataToRouteMatchMapper = this.createHandlerMetadataToRouteMatchMapper(
        node.path,
      );
      const relatedHandlerMetadata =
        MetadataStorage.getInstance().getMergedHandlerMetadataOfComponent(node.metadata.target);
      for (const metadata of relatedHandlerMetadata) {
        if (!(await this.areHandlerConditionsFulfilled(metadata))) {
          continue;
        }
        const intentNames = node.metadata.isGlobal
          ? metadata.intentNames
          : metadata.globalIntentNames;
        if (intentNames.includes(intentName) || intentNames.includes(InternalIntent.Unhandled)) {
          routeMatches.push(handlerMetadataToRouteMatchMapper(metadata));
        }
      }
    }

    return routeMatches;
  }

  private async getLocalRouteMatches(intentName: string): Promise<RouteMatch[]> {
    if (!this.jovo.$state?.length) {
      return [];
    }
    const routeMatches: RouteMatch[] = [];
    const latestStateStackItem = this.jovo.$state[this.jovo.$state.length - 1];
    const currentComponentPath = latestStateStackItem.componentPath.split('.');
    let subState = latestStateStackItem.$subState;

    let node: ComponentTreeNode | undefined =
      this.handleRequest.componentTree.getNodeAtOrFail(currentComponentPath);
    while (node) {
      const handlerMetadataToRouteMatchMapper = this.createHandlerMetadataToRouteMatchMapper(
        node.path,
      );
      const relatedHandlerMetadata =
        MetadataStorage.getInstance().getMergedHandlerMetadataOfComponent(node.metadata.target);

      for (const metadata of relatedHandlerMetadata) {
        if (!(await this.areHandlerConditionsFulfilled(metadata))) {
          continue;
        }

        if (
          (metadata.intentNames.includes(intentName) ||
            metadata.intentNames.includes(InternalIntent.Unhandled)) &&
          (subState ? metadata.options?.subState === subState : !metadata.options?.subState)
        ) {
          routeMatches.push(handlerMetadataToRouteMatchMapper(metadata));
        }
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
    const isConditionFulfilled =
      !metadata.options?.if || (await metadata.options?.if?.(this.handleRequest, this.jovo));
    return isPlatformSupported && isConditionFulfilled;
  }

  private createHandlerMetadataToRouteMatchMapper(
    path: string[],
  ): (metadata: HandlerMetadata) => RouteMatch {
    return (metadata) => {
      return new RouteMatch(metadata, path);
    };
  }
}
