import { HandleRequest } from '../../../HandleRequest';
import { Jovo } from '../../../Jovo';
import { HandlerMetadata } from '../metadata/HandlerMetadata';
import { HandlerMetadataStorage } from '../metadata/HandlerMetadataStorage';

export interface HandleOptions {
  if?: (handleRequest: HandleRequest, jovo: Jovo) => boolean | Promise<boolean>;
  intents?: string[];
  touch?: string[];
  gestures?: string[];

  [key: string]: unknown;
}

export function Handle(options?: HandleOptions): MethodDecorator {
  return function (target, propertyKey, descriptor) {
    HandlerMetadataStorage.getInstance().metadata.push(
      new HandlerMetadata(target.constructor, propertyKey, descriptor, options),
    );
  };
}
