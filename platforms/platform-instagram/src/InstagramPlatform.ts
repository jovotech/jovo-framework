import { AnyObject, App, HandleRequest, Jovo, Server } from '@jovotech/framework';
import { InstagramOutputTemplateConverterStrategy } from '@jovotech/output-instagram';
import {
  FacebookMessengerPlatform,
  FacebookMessengerUser as InstagramUser,
  MessengerBotEntry,
} from '@jovotech/platform-facebookmessenger';
import _cloneDeep from 'lodash.clonedeep';
import { Instagram } from './Instagram';
import { InstagramRequest } from './InstagramRequest';

export class InstagramPlatform extends FacebookMessengerPlatform {
  readonly outputTemplateConverterStrategy = new InstagramOutputTemplateConverterStrategy();
  readonly jovoClass = Instagram;
  readonly requestClass = InstagramRequest;
  readonly userClass = InstagramUser;

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);
    parent.middlewareCollection.use('before.request.start', (jovo) => {
      return this.beforeRequestStart(jovo);
    });
  }

  isRequestRelated(request: AnyObject | InstagramRequest): boolean {
    return request.$type === 'instagram' && request.id && request.time && !!request.messaging?.[0];
  }

  async beforeRequestStart(jovo: Jovo) {
    const senderId = jovo.$instagram?.$request?.messaging?.[0]?.sender?.id;
    const businessAccountId = jovo.$instagram?.$request?.id;
    if (senderId && businessAccountId && senderId === businessAccountId) {
      jovo.$handleRequest.stopMiddlewareExecution();
      return jovo.$handleRequest.server.setResponse({});
    }
  }

  augmentAppHandle(): void {
    super.augmentAppHandle();
    const APP_HANDLE = App.prototype.handle;
    App.prototype.handle = async function (server: Server) {
      const request = server.getRequestObject();

      const isInstagramRequest =
        request?.object === 'instagram' && Array.isArray(request?.entry) && request?.entry?.length;

      if (isInstagramRequest) {
        const promises = request.entry.map((entry: MessengerBotEntry) => {
          // Set platform origin on request entry
          entry.$type = 'instagram';
          const serverCopy = _cloneDeep(server);
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          serverCopy.setResponse = async () => {};
          serverCopy.getRequestObject = () => entry;

          return APP_HANDLE.call(this, serverCopy);
        });
        await Promise.all(promises);
        // TODO determine response content
        return server.setResponse({});
      } else {
        return APP_HANDLE.call(this, server);
      }
    };
  }
}
