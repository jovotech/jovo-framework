import { HandleRequest } from '../../../HandleRequest';
import { Jovo } from '../../../Jovo';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { MetadataStorage } from '../metadata/MetadataStorage';

export interface HandleOptions {
  if?: (handleRequest: HandleRequest, jovo: Jovo) => boolean | Promise<boolean>;
  intents?: string[];
  touch?: string[];
  gestures?: string[];

  [key: string]: unknown;
}

export function Handle(options?: HandleOptions): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    MetadataStorage.getInstance().handlerMetadata.push(
      new HandlerMetadata(target.constructor, propertyKey, descriptor, options),
    );
  };
}
