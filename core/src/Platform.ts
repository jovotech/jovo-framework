import { JovoResponse, OutputTemplateConverterStrategy } from '@jovotech/output';
import _merge from 'lodash.merge';
import { App, Constructor, HandleRequest, Jovo, JovoConstructor } from '.';
import { Extensible, ExtensibleConfig } from './Extensible';
import { JovoRequest } from './JovoRequest';
import { MiddlewareCollection } from './MiddlewareCollection';

export type PlatformBaseMiddlewares = [
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

export const BASE_PLATFORM_MIDDLEWARES: PlatformBaseMiddlewares = [
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
  CONFIG extends ExtensibleConfig = ExtensibleConfig
> extends Extensible<CONFIG, PlatformBaseMiddlewares> {
  readonly middlewareCollection = new MiddlewareCollection(...BASE_PLATFORM_MIDDLEWARES);
  abstract readonly requestClass: Constructor<REQUEST>;
  abstract readonly jovoClass: JovoConstructor<REQUEST, RESPONSE>;

  abstract outputTemplateConverterStrategy: OutputTemplateConverterStrategy<RESPONSE>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract isRequestRelated(request: REQUEST | Record<string, any>): boolean;

  // TODO: Determine whether this should be moved into Jovo. That would require changes in BaseComponent and BaseOutput.
  abstract prepareResponse(
    response: RESPONSE | RESPONSE[],
    jovo: Jovo,
  ): RESPONSE | RESPONSE[] | Promise<RESPONSE> | Promise<RESPONSE[]>;

  abstract setResponseSessionData(response: RESPONSE | RESPONSE[], jovo: Jovo): this;

  createJovoInstance<APP extends App>(
    app: APP,
    handleRequest: HandleRequest,
  ): Jovo<REQUEST, RESPONSE> {
    return new this.jovoClass(app, handleRequest, this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createRequestInstance(request: REQUEST | Record<string, any>): REQUEST {
    const instance = new this.requestClass();
    _merge(instance, request);
    return instance;
  }
}
