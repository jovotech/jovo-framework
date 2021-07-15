import {
  App,
  Extensible,
  ExtensibleConfig,
  JovoError,
  Platform,
  Server,
} from '@jovotech/framework';
import {
  FacebookMessengerOutputTemplateConverterStrategy,
  FacebookMessengerResponse,
} from '@jovotech/output-facebookmessenger';
import _cloneDeep from 'lodash.clonedeep';
import { DEFAULT_FACEBOOK_VERIFY_TOKEN, LATEST_FACEBOOK_API_VERSION } from './constants';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { FacebookMessengerUser } from './FacebookMessengerUser';
import { FacebookMessengerEntry } from './interfaces';
import { FacebookMessenger } from './FacebookMessenger';

export interface FacebookMessengerConfig extends ExtensibleConfig {
  version: typeof LATEST_FACEBOOK_API_VERSION | string;
  verifyToken: string;
  pageAccessToken: string;
}

export class FacebookMessengerPlatform extends Platform<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger,
  FacebookMessengerConfig
> {
  outputTemplateConverterStrategy = new FacebookMessengerOutputTemplateConverterStrategy();
  requestClass = FacebookMessengerRequest;
  jovoClass = FacebookMessenger;
  userClass = FacebookMessengerUser;

  async initialize(parent: Extensible): Promise<void> {
    if (super.initialize) {
      await super.initialize(parent);
    }
    this.augmentAppHandle();
  }

  getDefaultConfig(): FacebookMessengerConfig {
    return {
      verifyToken: DEFAULT_FACEBOOK_VERIFY_TOKEN,
      pageAccessToken: '',
      version: LATEST_FACEBOOK_API_VERSION,
    };
  }

  isRequestRelated(request: Record<string, any> | FacebookMessengerRequest): boolean {
    return request.id && request.time && request.messaging?.[0];
  }

  isResponseRelated(response: Record<string, any> | FacebookMessengerResponse): boolean {
    return response.recipient && response.message;
  }

  finalizeResponse(
    response: FacebookMessengerResponse[] | FacebookMessengerResponse,
    jovo: FacebookMessenger,
  ):
    | FacebookMessengerResponse[]
    | Promise<FacebookMessengerResponse>
    | Promise<FacebookMessengerResponse[]>
    | FacebookMessengerResponse {
    const senderId = jovo.$request.messaging?.[0]?.sender?.id;
    if (!senderId) {
      // TODO determine if error is good here
      throw new JovoError({
        message: 'Can not finalize response.',
        details: 'No sender-id was found.',
        context: {
          request: jovo.$request,
        },
      });
    }
    if (Array.isArray(response)) {
      response.forEach((responseItem) => {
        responseItem.recipient.id = senderId;
      });
    } else {
      response.recipient.id = senderId;
    }
    return response;
  }

  private augmentAppHandle() {
    const APP_HANDLE = App.prototype.handle;
    const getVerifyTokenFromConfig = function (this: FacebookMessengerPlatform) {
      return this.config.verifyToken;
    }.bind(this);
    App.prototype.handle = async function (server: Server) {
      const request = server.getRequestObject();

      const query = server.getQueryParams();
      const verifyMode = query['hub.mode'];
      const verifyChallenge = query['hub.challenge'];
      const verifyToken = query['hub.verify_token'];
      const isFacebookVerifyRequest =
        !Object.keys(request).length && verifyMode && verifyChallenge && verifyToken;

      const isFacebookMessengerRequest =
        request?.object === 'page' && Array.isArray(request?.entry) && request?.entry?.length;

      if (isFacebookVerifyRequest) {
        const configuredVerifyToken = getVerifyTokenFromConfig();
        if (verifyToken === configuredVerifyToken) {
          return server.setResponse(+(verifyChallenge as string));
        }
        throw new JovoError({
          message: 'The verify-token in the request does not match the configured verify-token.',
          context: {
            verifyToken,
            configuredVerifyToken,
          },
        });
      } else if (isFacebookMessengerRequest) {
        const promises = request.entry.map((entry: FacebookMessengerEntry) => {
          const serverCopy = _cloneDeep(server);
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
