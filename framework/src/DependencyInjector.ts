import { MetadataStorage } from './metadata/MetadataStorage';
import { Jovo } from './Jovo';
import { AnyObject, Constructor } from '@jovotech/common';
import { InjectionToken, Provider } from './metadata/InjectableMetadata';

export class DependencyInjector {
  private static resolveInjectionToken<TYPE extends AnyObject>(
    jovo: Jovo,
    token: InjectionToken,
  ): TYPE | undefined {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const providers: Provider<any>[] = [
      ...jovo.$app.providers,
      {
        provide: Jovo,
        useFactory: (jovo) => jovo,
      },
    ];
    const injection = providers.find((injection) => {
      if (typeof injection === 'function') {
        return injection === token;
      } else {
        return injection.provide === token;
      }
    }) as Provider<TYPE> | undefined;
    if (!injection) {
      return undefined;
    }
    if (typeof injection === 'function') {
      return DependencyInjector.instantiateClass(jovo, injection);
    } else if ('useValue' in injection) {
      return injection.useValue;
    } else if ('useFactory' in injection) {
      return injection.useFactory(jovo);
    } else if ('useClass' in injection) {
      return DependencyInjector.instantiateClass(jovo, injection.useClass);
    } else if ('useExisting' in injection) {
      return DependencyInjector.resolveInjectionToken(jovo, injection.useExisting);
    }
  }

  static instantiateClass<TYPE, ARGS extends unknown[] = []>(
    jovo: Jovo,
    clazz: Constructor<TYPE>,
    ...predefinedArgs: ARGS
  ): TYPE {
    const injectedArgs = [...predefinedArgs];
    const storage = MetadataStorage.getInstance();
    const injectMetadata = storage.getMergedInjectMetadata(clazz);
    const argTypes = Reflect.getMetadata('design:paramtypes', clazz) ?? [];
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
      const injectedValue = DependencyInjector.resolveInjectionToken(jovo, injectionToken);
      injectedArgs.push(injectedValue);
    }

    return new clazz(...injectedArgs);
  }
}
