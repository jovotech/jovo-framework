// TODO determine whether we want to re-export axios
import axios from 'axios';
import type { A } from 'ts-toolbelt';
import type { PartialDeep } from 'type-fest';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('source-map-support').install();

export * from 'axios';
export { axios };

// Return the type of the items in the array.
export type ArrayElement<ARRAY_TYPE extends readonly unknown[]> = ARRAY_TYPE[number];
export type DeepPartial<T> = PartialDeep<T>;
export type Constructor<T, ARGS extends unknown[] = unknown[]> = new (...args: ARGS) => T;
// Construct object from properties of T that extend U.
export type PickWhere<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;
// If K equals I return never, otherwise return the key.
export type FilterKey<K, I> = A.Equals<K, I> extends 1 ? never : K;
// Omit index signature of T if it equals index-signature I.
export type OmitIndex<T, I extends string | number> = {
  [K in keyof T as FilterKey<K, I>]: T[K];
};

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
export * from './ComponentTree';
export * from './Extensible';
export * from './HandleRequest';
export * from './I18Next';
export * from './Jovo';
export * from './JovoError';
export * from './JovoProxy';
export * from './JovoRequest';
export * from './JovoSession';
export * from './JovoUser';
export * from './Middleware';
export * from './MiddlewareCollection';
export * from './NluPlugin';
export * from './Platform';
export * from './Plugin';
export * from './Server';

export * from './decorators/Component';
export * from './decorators/Global';
export * from './decorators/Handle';
export * from './decorators/If';
export * from './decorators/Intents';
export * from './decorators/Output';
export * from './decorators/Platforms';
export * from './decorators/PrioritizeOverUnhandled';
export * from './decorators/SubState';

export * from './errors/ComponentNotFoundError';
export * from './errors/DuplicateChildComponentsError';
export * from './errors/DuplicateGlobalIntentsError';
export * from './errors/HandlerNotFoundError';
export * from './errors/InvalidParentError';
export * from './errors/MatchingRouteNotFoundError';
export * from './errors/MatchingPlatformNotFoundError';

export * from './metadata/ClassDecoratorMetadata';
export * from './metadata/ComponentMetadata';
export * from './metadata/ComponentOptionMetadata';
export * from './metadata/HandlerMetadata';
export * from './metadata/HandlerOptionMetadata';
export * from './metadata/MetadataStorage';
export * from './metadata/MethodDecoratorMetadata';
export * from './metadata/OutputMetadata';

export * from './plugins/BasicLogging';
export * from './plugins/HandlerPlugin';
export * from './plugins/OutputPlugin';
export * from './plugins/RouteMatch';
export * from './plugins/RouterPlugin';
export * from './plugins/RoutingExecutor';

export * from './interfaces';
export * from './enums';
export * from './utilities';

