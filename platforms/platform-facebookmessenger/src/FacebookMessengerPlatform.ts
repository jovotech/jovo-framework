import {
  AnyObject,
  App,
  axios,
  AxiosResponse,
  Extensible,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  JovoError,
  Platform,
  Server,
  StoredElementSession,
  UnknownObject,
} from '@jovotech/framework';
import {
  FacebookMessengerOutputTemplateConverterStrategy,
  FacebookMessengerResponse,
} from '@jovotech/output-facebookmessenger';
import _cloneDeep from 'lodash.clonedeep';
import {
  DEFAULT_FACEBOOK_VERIFY_TOKEN,
  FACEBOOK_API_BASE_URL,
  LATEST_FACEBOOK_API_VERSION,
} from './constants';
import { FacebookMessenger } from './FacebookMessenger';
import { FacebookMessengerDevice } from './FacebookMessengerDevice';
import { FacebookMessengerRequest } from './FacebookMessengerRequest';
import { FacebookMessengerRequestBuilder } from './FacebookMessengerRequestBuilder';
import { FacebookMessengerUser } from './FacebookMessengerUser';
import { MessengerBotEntry } from './interfaces';

export interface FacebookMessengerConfig extends ExtensibleConfig {
  version: typeof LATEST_FACEBOOK_API_VERSION | string;
  verifyToken: string;
  pageAccessToken: string;

  session?: StoredElementSession & { enabled?: never };
}

export class FacebookMessengerPlatform extends Platform<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger,
  FacebookMessengerUser,
  FacebookMessengerDevice,
  FacebookMessengerPlatform,
  FacebookMessengerConfig
> {
  outputTemplateConverterStrategy = new FacebookMessengerOutputTemplateConverterStrategy();
  requestClass = FacebookMessengerRequest;
  jovoClass = FacebookMessenger;
  userClass = FacebookMessengerUser;
  deviceClass = FacebookMessengerDevice;
  requestBuilder = FacebookMessengerRequestBuilder;

  get apiVersion(): string {
    return this.config.version || LATEST_FACEBOOK_API_VERSION;
  }

  get pageAccessToken(): string {
    return this.config.pageAccessToken;
  }

  get endpoint(): string {
    return `${FACEBOOK_API_BASE_URL}/${this.apiVersion}/me/messages?access_token=${this.pageAccessToken}`;
  }

  async initialize(parent: Extensible): Promise<void> {
    if (super.initialize) {
      await super.initialize(parent);
    }
    this.augmentAppHandle();
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);

    this.middlewareCollection.use('request.start', (jovo) => {
      return this.enableDatabaseSessionStorage(jovo, this.config.session);
    });
  }

  getDefaultConfig(): FacebookMessengerConfig {
    return {
      verifyToken: DEFAULT_FACEBOOK_VERIFY_TOKEN,
      pageAccessToken: '',
      version: LATEST_FACEBOOK_API_VERSION,
    };
  }

  isRequestRelated(request: AnyObject | FacebookMessengerRequest): boolean {
    return request.$type === 'facebook' && request.id && request.time && request.messaging?.[0];
  }

  isResponseRelated(response: AnyObject | FacebookMessengerResponse): boolean {
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
    const senderId = jovo.$user.id;
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

  augmentAppHandle(): void {
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
        (!request || !Object.keys(request).length) && verifyMode && verifyChallenge && verifyToken;

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
        const promises = request.entry.map((entry: MessengerBotEntry) => {
          // Set platform origin on request entry
          entry.$type = 'facebook';
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

  async sendData<RESPONSE extends AnyObject>(
    data: UnknownObject,
  ): Promise<AxiosResponse<RESPONSE>> {
    if (!this.pageAccessToken) {
      throw new JovoError({
        message: 'Can not send message to Facebook due to a missing or empty page-access-token.',
      });
    }
    try {
      console.log(data);
      // TODO: AttachmentMessage-support
      return await axios.post<RESPONSE>(this.endpoint, data);
    } catch (error) {
      if (error.isAxiosError) {
        console.log(error.response.data);
        throw new JovoError({ message: error.message, details: error.response.data.error.message });
      }

      throw error;
    }
  }
}
