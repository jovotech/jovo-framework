import { OutputConverterStrategy } from 'jovo-output';
import _merge from 'lodash.merge';
import { App, HandleRequest, Jovo, JovoConstructor } from '.';
import { Extensible, ExtensibleConfig } from './Extensible';
import { JovoRequest } from './JovoRequest';
import { JovoResponse } from './JovoResponse';
import { MiddlewareCollection } from './MiddlewareCollection';

export const DEFAULT_PLATFORM_MIDDLEWARES = [
  '$init',
  '$request',
  '$session',
  '$user',
  '$type',
  '$nlu',
  '$inputs',
  '$output',
  '$response',
];

export type Constructor<T> = new (...args: unknown[]) => T;

export abstract class Platform<
  REQ extends JovoRequest = JovoRequest,
  RES extends JovoResponse = JovoResponse,
  C extends ExtensibleConfig = ExtensibleConfig,
  N extends string[] = [
    '$init',
    '$request',
    '$session',
    '$user',
    '$type',
    '$nlu',
    '$inputs',
    '$output',
    '$response',
  ]
> extends Extensible<C, N> {
  readonly middlewareCollection = new MiddlewareCollection(...DEFAULT_PLATFORM_MIDDLEWARES);
  abstract readonly requestClass: Constructor<REQ>;
  abstract readonly jovoClass: JovoConstructor<REQ, RES>;

  abstract outputConverterStrategy: OutputConverterStrategy<RES>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isRequestRelated(request: REQ | Record<string, any>): boolean;

  createJovoInstance(app: App, handleRequest: HandleRequest): Jovo<REQ, RES> {
    return new this.jovoClass(app, handleRequest, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createRequestInstance(request: REQ | Record<string, any>): REQ {
    const instance = new this.requestClass();
    _merge(instance, request);
    return instance;
  }
}
