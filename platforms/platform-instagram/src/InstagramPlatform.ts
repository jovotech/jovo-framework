import { AnyObject, App, ExtensibleInitConfig, Server } from '@jovotech/framework';
import { OmitIndex } from '@jovotech/output';
import {
  InstagramOutputTemplateConverterStrategy,
  InstagramResponse,
} from '@jovotech/output-instagram';
import {
  FacebookMessengerConfig,
  FacebookMessengerPlatform,
  MessengerBotEntry,
} from '@jovotech/platform-facebookmessenger';
import _cloneDeep from 'lodash.clonedeep';
import { Instagram } from './Instagram';
import { InstagramDevice } from './InstagramDevice';
import { InstagramRequest } from './InstagramRequest';
import { InstagramUser } from './InstagramUser';

export interface InstagramConfig
  extends Omit<OmitIndex<FacebookMessengerConfig, string>, 'senderActions'> {
  [key: string]: unknown;
}

export class InstagramPlatform extends FacebookMessengerPlatform {
  readonly outputTemplateConverterStrategy = new InstagramOutputTemplateConverterStrategy();
  readonly jovoClass = Instagram;
  readonly requestClass = InstagramRequest;
  readonly userClass = InstagramUser;
  readonly deviceClass = InstagramDevice;

  // Overwrite the constructor to apply typings from InstagramConfig,
  // since we can't pass the type in the generic parameters
  constructor(config?: ExtensibleInitConfig<InstagramConfig>) {
    super(config);
  }

  isRequestRelated(request: AnyObject | InstagramRequest): boolean {
    return request.$type === 'instagram' && request.id && request.time && !!request.messaging?.[0];
  }

  augmentAppHandle(): void {
    super.augmentAppHandle();
    const APP_HANDLE = App.prototype.handle;
    App.prototype.handle = async function (server: Server) {
      const request = server.getRequestObject();

      const isInstagramRequest =
        request?.object === 'instagram' && Array.isArray(request?.entry) && request?.entry?.length;

      if (isInstagramRequest) {
        const responses: InstagramResponse[] = [];
        const promises = request.entry.map((entry: MessengerBotEntry) => {
          // Set platform origin on request entry
          entry.$type = 'instagram';
          const serverCopy = _cloneDeep(server);
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          serverCopy.setResponse = async (response: InstagramResponse) => {
            responses.push(response);
          };
          serverCopy.getRequestObject = () => entry;
          return APP_HANDLE.call(this, serverCopy);
        });
        await Promise.all(promises);
        return server.setResponse(responses);
      } else {
        return APP_HANDLE.call(this, server);
      }
    };
  }
}
