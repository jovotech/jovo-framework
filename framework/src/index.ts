// TODO: Usages of .constructor.name cause errors in webpack, because the name is not the class-name mostly when minimizing.
// It has to be checked whether constructor is valid and can be used to instantiate a new instance for example.

// TODO determine whether we want to re-export axios
import axios from 'axios';
export * from 'axios';
export { axios };

export type ArrayElement<ARRAY_TYPE extends readonly unknown[]> = ARRAY_TYPE[number];
export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export type Constructor<T, ARGS extends unknown[] = unknown[]> = new (...args: ARGS) => T;
// Construct object from properties of T that extend U
export type PickWhere<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('source-map-support').install();
export {
  JovoResponse,
  OutputTemplateConverterStrategy,
  OutputTemplateConverter,
  OutputTemplate,
  OutputTemplateBase,
  OutputTemplatePlatforms,
  Carousel,
  Card,
  QuickReply,
  QuickReplyValue,
  Message,
  MessageValue,
  PlatformOutputTemplate,
  OutputValidationError,
} from '@jovotech/output';

export * from './App';
export * from './BaseComponent';
export * from './BaseOutput';
export * from './ComponentPlugin';
export * from './Extensible';
export * from './HandleRequest';
export * from './Jovo';
export * from './JovoError';
export * from './JovoRequest';
export * from './JovoSession';
export * from './JovoUser';
export * from './Middleware';
export * from './MiddlewareCollection';
export * from './Platform';
export * from './Plugin';
export * from './BaseOutput';
export * from './Server';
export * from './errors/ComponentNotFoundError';
export * from './errors/DuplicateChildComponentsError';
export * from './errors/DuplicateGlobalIntentsError';
export * from './errors/HandlerNotFoundError';
export * from './errors/InvalidParentError';
export * from './errors/MatchingRouteNotFoundError';
export * from './errors/MatchingPlatformNotFoundError';

export * from './metadata/MetadataStorage';
export * from './decorators/Component';
export * from './decorators/Output';
export * from './decorators/Handle';

export * from './interfaces';
export * from './enums';
