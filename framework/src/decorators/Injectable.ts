import { AnyObject, Constructor } from '@jovotech/common';
import { InjectableMetadata, InjectableOptions } from '../metadata/InjectableMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

export function Injectable<PROVIDER = AnyObject>(
  options?: InjectableOptions,
): (target: Constructor<PROVIDER>) => void {
  return function (target) {
    const metadata = new InjectableMetadata(target, options);
    const storage = MetadataStorage.getInstance();
    storage.addInjectableMetadata(metadata);
  };
}
