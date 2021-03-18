// TODO: Usages of .constructor.name cause errors in webpack, because the name is not the class-name mostly when minimizing.
// It has to be checked whether constructor is valid and can be used to instantiate a new instance for example.

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export type Constructor<T> = new (...args: unknown[]) => T;
// Construct object from properties of T that extend U
export type PickWhere<T, U> = Pick<
  T,
  {
    [K in keyof T]: T[K] extends U ? K : never;
  }[keyof T]
>;

export {
  JovoResponse,
  OutputTemplateConverterStrategy,
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
export * from './Middleware';
export * from './MiddlewareCollection';
export * from './Platform';
export * from './Plugin';

export * from './errors/ComponentNotFoundError';
export * from './errors/DuplicateChildComponentsError';
export * from './errors/DuplicateGlobalIntentsError';
export * from './errors/HandlerNotFoundError';
export * from './errors/InvalidParentError';
export * from './errors/MatchingComponentNotFoundError';
export * from './errors/MatchingPlatformNotFoundError';

export * from './metadata/MetadataStorage';
export * from './decorators/Component';
export * from './decorators/Handle';

export * from './interfaces';
export * from './enums';
