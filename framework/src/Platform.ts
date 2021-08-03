import { JovoResponse, OutputTemplateConverterStrategy } from '@jovotech/output';
import _merge from 'lodash.merge';
import {
  AnyObject,
  App,
  AppBaseMiddleware,
  ArrayElement,
  Constructor,
  HandleRequest,
  InvalidParentError,
  Jovo,
  JovoConstructor,
  JovoUser,
} from '.';
import { Extensible, ExtensibleConfig } from './Extensible';
import { JovoRequest } from './JovoRequest';
import { JovoUserConstructor } from './JovoUser';
import { MiddlewareCollection } from './MiddlewareCollection';
import { JovoDevice, JovoDeviceConstructor } from './JovoDevice';

export type PlatformBaseMiddlewares = [
  '$init',
  '$request',
  '$session',
  '$user',
  '$type',
  '$asr',
  '$nlu',
  '$inputs',
  '$output',
  '$response',
];

export type PlatformBaseMiddleware = ArrayElement<PlatformBaseMiddlewares>;

export const BASE_PLATFORM_MIDDLEWARES: PlatformBaseMiddlewares = [
  '$init',
  '$request',
  '$session',
  '$user',
  '$type',
  '$asr',
  '$nlu',
  '$inputs',
  '$output',
  '$response',
];

export abstract class Platform<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  JOVO extends Jovo<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM> = any,
  USER extends JovoUser<JOVO> = JovoUser<JOVO>,
  DEVICE extends JovoDevice<JOVO> = JovoDevice<JOVO>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM, CONFIG> = any,
  CONFIG extends ExtensibleConfig = ExtensibleConfig,
> extends Extensible<CONFIG, PlatformBaseMiddlewares> {
  abstract readonly requestClass: Constructor<REQUEST>;
  abstract readonly jovoClass: JovoConstructor<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM>;
  abstract readonly userClass: JovoUserConstructor<JOVO>;
  abstract readonly deviceClass: JovoDeviceConstructor<JOVO>;

  abstract outputTemplateConverterStrategy: OutputTemplateConverterStrategy<RESPONSE>;

  abstract isRequestRelated(request: REQUEST | AnyObject): boolean;

  abstract isResponseRelated(response: RESPONSE | AnyObject): boolean;
  abstract finalizeResponse(
    response: RESPONSE | RESPONSE[],
    jovo: JOVO,
  ): RESPONSE | RESPONSE[] | Promise<RESPONSE> | Promise<RESPONSE[]>;

  initializeMiddlewareCollection(): MiddlewareCollection<PlatformBaseMiddlewares> {
    return new MiddlewareCollection<PlatformBaseMiddlewares>(...BASE_PLATFORM_MIDDLEWARES);
  }

  install(parent: Extensible): void {
    if (!(parent instanceof App)) {
      throw new InvalidParentError(this.constructor.name, App);
    }
    const propagateMiddleware = (
      appMiddleware: AppBaseMiddleware,
      middleware: PlatformBaseMiddleware,
    ) => {
      parent.middlewareCollection.use(
        appMiddleware,
        async (handleRequest: HandleRequest, jovo: Jovo, ...args) => {
          if (jovo.$platform?.constructor?.name !== this.constructor.name) {
            return;
          }
          return this.middlewareCollection.run(middleware, handleRequest, jovo, ...args);
        },
      );
    };

    // TODO determine actual middleware mappings and add missing ones
    propagateMiddleware('request', '$request');
    propagateMiddleware('interpretation.asr', '$asr');
    propagateMiddleware('interpretation.nlu', '$nlu');
  }

  createJovoInstance<APP extends App>(app: APP, handleRequest: HandleRequest): JOVO {
    return new this.jovoClass(app, handleRequest, this as unknown as PLATFORM);
  }

  createRequestInstance(request: REQUEST | AnyObject): REQUEST {
    const instance = new this.requestClass();
    _merge(instance, request);
    return instance;
  }

  createUserInstance(jovo: JOVO): USER {
    return new this.userClass(jovo);
  }
  createDeviceInstance(jovo: JOVO): DEVICE {
    return new this.deviceClass(jovo);
  }
}
