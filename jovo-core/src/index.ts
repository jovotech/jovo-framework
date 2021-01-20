// TODO: Usages of .constructor.name cause errors in webpack, because the name is not the class-name mostly when minimizing.
// It has to be checked whether constructor is valid and can be used to instantiate a new instance for example.

export type DeepPartial<T> = { [P in keyof T]?: DeepPartial<T[P]> };
export type Constructor<T> = new (...args: unknown[]) => T;

export * from './App';
export * from './BaseComponent';
export * from './ComponentPlugin';
export * from './Extensible';
export * from './HandleRequest';
export * from './Jovo';
export * from './JovoRequest';
export * from './JovoResponse';
export * from './Middleware';
export * from './MiddlewareCollection';
export * from './Platform';
export * from './Plugin';

export * from './interfaces';
export * from './enums';
