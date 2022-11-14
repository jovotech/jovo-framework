import { MetadataStorage } from './metadata/MetadataStorage';
import { Jovo } from './Jovo';
import { AnyObject, ArrayElement, Constructor } from '@jovotech/common';
import { InjectionToken, Provider } from './metadata/InjectableMetadata';
import { CircularDependencyError } from './errors/CircularDependencyError';

const INSTANTIATE_DEPENDENCY_MIDDLEWARE = 'event.DependencyInjector.instantiateDependency';

export interface DependencyTree<Node> {
  token: InjectionToken;
  resolvedValue: Node;
  children: DependencyTree<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Node extends Constructor<any, infer Args> ? ArrayElement<Args> : unknown
  >[];
}

export class DependencyInjector {
  private static resolveInjectionToken<TYPE extends AnyObject>(
    jovo: Jovo,
    token: InjectionToken,
    dependencyPath: InjectionToken[],
  ): DependencyTree<TYPE | undefined> {
    if (dependencyPath.includes(token)) {
      throw new CircularDependencyError(dependencyPath);
    }
    const providers = [...jovo.$app.providers, ...jovo.$app.systemProviders];

    const updatedPath = [...dependencyPath, token];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const injection = providers.find((injection) => {
      if (typeof injection === 'function') {
        return injection === token;
      } else {
        return injection.provide === token;
      }
    }) as Provider<TYPE> | undefined;
    if (!injection) {
      return {
        token,
        resolvedValue: undefined,
        children: [],
      };
    }

    if (typeof injection === 'function') {
      return DependencyInjector.instantiateClassWithTracing(jovo, injection, updatedPath);
    } else if ('useValue' in injection) {
      return {
        token,
        resolvedValue: injection.useValue,
        children: [],
      };
    } else if ('useFactory' in injection) {
      const value = injection.useFactory(jovo);
      return {
        token,
        resolvedValue: value,
        children: [],
      };
    } else if ('useClass' in injection) {
      const tree = DependencyInjector.instantiateClassWithTracing(
        jovo,
        injection.useClass,
        updatedPath,
      );
      // insert proper token
      return {
        ...tree,
        token,
      };
    } else if ('useExisting' in injection) {
      const tree = DependencyInjector.resolveInjectionToken(
        jovo,
        injection.useExisting,
        updatedPath,
      );
      return {
        token,
        resolvedValue: tree?.resolvedValue as TYPE,
        children: tree?.children ?? [],
      };
    } else {
      return {
        token,
        resolvedValue: undefined,
        children: [],
      };
    }
  }

  private static instantiateClassWithTracing<TYPE, ARGS extends unknown[] = []>(
    jovo: Jovo,
    clazz: Constructor<TYPE>,
    dependencyPath: InjectionToken[],
    ...predefinedArgs: ARGS
  ): DependencyTree<TYPE> {
    const injectedArgs = [...predefinedArgs];
    const storage = MetadataStorage.getInstance();
    const injectMetadata = storage.getMergedInjectMetadata(clazz);
    const argTypes = Reflect.getMetadata('design:paramtypes', clazz) ?? [];
    const children: DependencyTree<unknown>[] = [];
    for (let i = predefinedArgs.length; i < argTypes.length; i++) {
      const injectMetadataForArg = injectMetadata.find((metadata) => metadata.index === i);
      let injectionToken: InjectionToken;
      if (injectMetadataForArg) {
        injectionToken = injectMetadataForArg.token;
      } else {
        injectionToken = argTypes[i];
      }
      if (!injectionToken) {
        injectedArgs.push(undefined);
        continue;
      }
      const childNode = DependencyInjector.resolveInjectionToken(
        jovo,
        injectionToken,
        dependencyPath,
      );
      injectedArgs.push(childNode?.resolvedValue);
      children.push(childNode);
    }

    const instance = new clazz(...injectedArgs);
    return {
      token: clazz,
      resolvedValue: instance,
      children,
    };
  }

  static async instantiateClass<TYPE, ARGS extends unknown[] = []>(
    jovo: Jovo,
    clazz: Constructor<TYPE>,
    ...predefinedArgs: ARGS
  ): Promise<TYPE> {
    const tree = this.instantiateClassWithTracing(jovo, clazz, [], ...predefinedArgs);
    await jovo.$handleRequest.middlewareCollection.run(
      INSTANTIATE_DEPENDENCY_MIDDLEWARE,
      jovo,
      tree,
    );
    return tree.resolvedValue;
  }
}
