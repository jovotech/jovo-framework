import { AnyObject, Constructor } from '@jovotech/common';
import { InjectableMetadata, InjectableOptions } from '../metadata/InjectableMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

/**
 * Decorator to mark a class as injectable.
 * This allows the class to be automatically constructed by the dependency injection system.
 * @param options
 */
export function Injectable<PROVIDER = AnyObject>(
  options?: InjectableOptions,
): (target: Constructor<PROVIDER>) => void {
  return function (target) {
    const metadata = new InjectableMetadata(target, options);
    const storage = MetadataStorage.getInstance();
    storage.addInjectableMetadata(metadata);
  };
}
