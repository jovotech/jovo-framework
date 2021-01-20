import { OutputConverterStrategy } from 'jovo-output';
import _merge from 'lodash.merge';
import { App, Constructor, HandleRequest, Jovo, JovoConstructor } from '.';
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

export abstract class Platform<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  CONFIG extends ExtensibleConfig = ExtensibleConfig,
  MIDDLEWARES extends string[] = [
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
> extends Extensible<CONFIG, MIDDLEWARES> {
  readonly middlewareCollection = new MiddlewareCollection(...DEFAULT_PLATFORM_MIDDLEWARES);
  abstract readonly requestClass: Constructor<REQUEST>;
  abstract readonly jovoClass: JovoConstructor<REQUEST, RESPONSE>;

  abstract outputConverterStrategy: OutputConverterStrategy<RESPONSE>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isRequestRelated(request: REQUEST | Record<string, any>): boolean;

  createJovoInstance(app: App, handleRequest: HandleRequest): Jovo<REQUEST, RESPONSE> {
    return new this.jovoClass(app, handleRequest, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createRequestInstance(request: REQUEST | Record<string, any>): REQUEST {
    const instance = new this.requestClass();
    _merge(instance, request);
    return instance;
  }
}
