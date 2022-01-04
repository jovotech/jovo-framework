import { AnyObject, Constructor } from '@jovotech/common';
import { JovoResponse, OutputTemplateConverterStrategy } from '@jovotech/output';
import _merge from 'lodash.merge';
import {
  App,
  APP_MIDDLEWARES,
  AppMiddlewares,
  DbPlugin,
  HandleRequest,
  IntentMap,
  InvalidParentError,
  Jovo,
  JovoConstructor,
  JovoUser,
  RequestBuilder,
  StoredElementSession,
} from '.';

import { Extensible, ExtensibleConfig } from './Extensible';
import { JovoDevice, JovoDeviceConstructor } from './JovoDevice';
import { JovoRequest } from './JovoRequest';
import { JovoUserConstructor } from './JovoUser';
import { MiddlewareCollection } from './MiddlewareCollection';

export type PlatformMiddlewares = AppMiddlewares;

export interface PlatformConfig extends ExtensibleConfig {
  intentMap?: IntentMap;
}

export abstract class Platform<
  REQUEST extends JovoRequest = JovoRequest,
  RESPONSE extends JovoResponse = JovoResponse,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  JOVO extends Jovo<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM> = any,
  USER extends JovoUser<JOVO> = JovoUser<JOVO>,
  DEVICE extends JovoDevice<JOVO> = JovoDevice<JOVO>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  PLATFORM extends Platform<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM, CONFIG> = any,
  CONFIG extends PlatformConfig = PlatformConfig,
> extends Extensible<CONFIG, PlatformMiddlewares> {
  abstract readonly id: string;
  abstract readonly requestClass: Constructor<REQUEST>;
  abstract readonly jovoClass: JovoConstructor<REQUEST, RESPONSE, JOVO, USER, DEVICE, PLATFORM>;
  abstract readonly userClass: JovoUserConstructor<JOVO>;
  abstract readonly deviceClass: JovoDeviceConstructor<JOVO>;
  abstract readonly requestBuilder: Constructor<RequestBuilder<PLATFORM>>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  abstract outputTemplateConverterStrategy: OutputTemplateConverterStrategy<RESPONSE, any>;

  abstract isRequestRelated(request: REQUEST | AnyObject): boolean;

  abstract isResponseRelated(response: RESPONSE | AnyObject): boolean;

  abstract finalizeResponse(
    response: RESPONSE | RESPONSE[],
    jovo: JOVO,
  ): RESPONSE | RESPONSE[] | Promise<RESPONSE> | Promise<RESPONSE[]>;

  initializeMiddlewareCollection(): MiddlewareCollection<PlatformMiddlewares> {
    return new MiddlewareCollection<PlatformMiddlewares>(...APP_MIDDLEWARES);
  }

  mount(parent: Extensible): void {
    if (!(parent instanceof HandleRequest)) {
      throw new InvalidParentError(this.name, HandleRequest);
    }
    // propagate runs of middlewares of parent to middlewares of this
    this.middlewareCollection.names.forEach((middlewareName) => {
      parent.middlewareCollection.use(middlewareName, async (jovo) => {
        if (jovo.$platform?.name !== this.name) {
          return;
        }
        return this.middlewareCollection.run(middlewareName, jovo);
      });
    });
  }

  createJovoInstance<APP extends App>(app: APP, handleRequest: HandleRequest): JOVO {
    return new this.jovoClass(app, handleRequest, handleRequest.platform as unknown as PLATFORM);
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

  protected enableDatabaseSessionStorage(
    jovo: Jovo,
    sessionConfig?: StoredElementSession & { enabled?: never },
  ): void {
    const dbPlugins = Object.values(jovo.$handleRequest.plugins).filter(
      (plugin) => plugin instanceof DbPlugin,
    ) as DbPlugin[];

    if (!dbPlugins.length) {
      // eslint-disable-next-line no-console
      console.warn('No database plugin is installed. Session storage can not be enabled.');
    }

    dbPlugins.forEach((dbPlugin) => {
      if (!dbPlugin.config.storedElements) {
        dbPlugin.config.storedElements = dbPlugin.getDefaultConfig().storedElements || {};
      }
      // eslint-disable-next-line no-console
      console.warn(`Session storage was enabled for database plugin ${dbPlugin.name}`);

      if (sessionConfig) {
        dbPlugin.config.storedElements.session = { ...sessionConfig, enabled: true };
      } else {
        dbPlugin.config.storedElements.session = true;
      }
    });
  }
}
