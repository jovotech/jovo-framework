import { InjectionToken } from '../metadata/InjectableMetadata';
import { AnyObject, Constructor } from '@jovotech/common';
import { InjectMetadata } from '../metadata/InjectMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

/**
 * Decorator to specify a dependency injection token for a constructor parameter.
 *
 * If `@Inject()` is omitted or used without a token parameter, the type of the parameter is used as the token.
 *
 * @param token
 * @constructor
 */
export function Inject<PROVIDER = AnyObject>(
  token?: InjectionToken,
): (target: Constructor<PROVIDER>, propertyKey: string, index: number) => void {
  return function (target, propertyKey, index) {
    let resolvedToken: InjectionToken;
    if (token) {
      resolvedToken = token;
    } else {
      resolvedToken = Reflect.getMetadata('design:paramtypes', target)[index];
    }
    const metadata = new InjectMetadata<PROVIDER>(target, index, resolvedToken);
    const storage = MetadataStorage.getInstance();
    storage.addInjectMetadata(metadata);
  };
}
