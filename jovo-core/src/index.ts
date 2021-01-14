// TODO: Usages of .constructor.name cause errors in webpack, because the name is not the class-name mostly when minimizing.
// It has to be checked whether constructor is valid and can be used to instantiate a new instance for example.

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };

export * from './App';
export * from './Extensible';
export * from './HandleRequest';
export * from './Jovo';
export * from './JovoRequest';
export * from './JovoResponse';
export * from './Middleware';
export * from './MiddlewareCollection';
export * from './Platform';
export * from './Plugin';
