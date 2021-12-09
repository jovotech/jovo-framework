import {
  AnyObject,
  App,
  axios,
  AxiosResponse,
  Extensible,
  ExtensibleConfig,
  ExtensibleInitConfig,
  HandleRequest,
  Jovo,
  JovoError,
  Platform,
  Server,
  StoredElementSession,
  UnknownObject,
} from '@jovotech/framework';
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
import { FacebookMessengerResponse } from './FacebookMessengerResponse';
import { FacebookMessengerUser } from './FacebookMessengerUser';
import { MessengerBotEntry, SenderAction } from './interfaces';
import { FacebookMessengerOutputTemplateConverterStrategy } from './output';

export interface FacebookMessengerConfig extends ExtensibleConfig {
  version: typeof LATEST_FACEBOOK_API_VERSION | string;
  verifyToken: string;
  pageAccessToken: string;
  senderActions?: {
    markSeen?: boolean;
    typingIndicator?: boolean;
  };
  session?: StoredElementSession & { enabled?: never };
}

export type FacebookMessengerInitConfig = ExtensibleInitConfig<
  FacebookMessengerConfig,
  'pageAccessToken'
>;

export class FacebookMessengerPlatform extends Platform<
  FacebookMessengerRequest,
  FacebookMessengerResponse,
  FacebookMessenger,
  FacebookMessengerUser,
  FacebookMessengerDevice,
  FacebookMessengerPlatform,
  FacebookMessengerConfig
> {
  readonly id: string = 'facebookMessenger';
  readonly outputTemplateConverterStrategy = new FacebookMessengerOutputTemplateConverterStrategy();
  readonly requestClass = FacebookMessengerRequest;
  readonly jovoClass = FacebookMessenger;
  readonly userClass = FacebookMessengerUser;
  readonly deviceClass = FacebookMessengerDevice;
  readonly requestBuilder = FacebookMessengerRequestBuilder;

  get apiVersion(): string {
    return this.config.version || LATEST_FACEBOOK_API_VERSION;
  }

  get pageAccessToken(): string {
    return this.config.pageAccessToken;
  }

  get endpoint(): string {
    return `${FACEBOOK_API_BASE_URL}/${this.apiVersion}/me/messages?access_token=${this.pageAccessToken}`;
  }

  constructor(config: FacebookMessengerInitConfig) {
    super(config);
  }

  async initialize(parent: Extensible): Promise<void> {
    if (super.initialize) {
      await super.initialize(parent);
    }
    this.augmentAppHandle();
  }

  mount(parent: HandleRequest): Promise<void> | void {
    super.mount(parent);

    this.middlewareCollection.use(
      'after.request.end',
      (jovo) => this.enableDatabaseSessionStorage(jovo, this.config.session),
      this.markAsSeen.bind(this),
    );

    this.middlewareCollection.use('dialogue.start', this.enableTypingIndicator.bind(this));
    this.middlewareCollection.use('dialogue.end', this.disableTypingIndicator.bind(this));
    this.middlewareCollection.use('before.request.start', this.ignoreOwnSenderId.bind(this));
  }

  getDefaultConfig(): FacebookMessengerConfig {
    return {
      ...this.getInitConfig(),
      verifyToken: DEFAULT_FACEBOOK_VERIFY_TOKEN,
      version: LATEST_FACEBOOK_API_VERSION,
      senderActions: {
        markSeen: true,
        typingIndicator: true,
      },
    };
  }

  getInitConfig(): FacebookMessengerInitConfig {
    return {
      pageAccessToken: '<YOUR-PAGE-ACCESS-TOKEN>',
    };
  }

  async ignoreOwnSenderId(jovo: Jovo): Promise<void> {
    const senderId: string | undefined = (jovo.$request as FacebookMessengerRequest)?.messaging?.[0]
      ?.sender?.id;
    const businessAccountId: string | undefined = (jovo.$request as FacebookMessengerRequest)?.id;

    if (senderId && businessAccountId && senderId === businessAccountId) {
      jovo.$handleRequest.stopMiddlewareExecution();
      return jovo.$handleRequest.server.setResponse({});
    }
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
    const senderId: string | undefined = jovo.$user.id;
    if (!senderId) {
      // TODO determine if error is good here
      throw new JovoError({
        message: 'Can not finalize response: No sender-id was found.',
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
        const responses: FacebookMessengerResponse[] = [];
        const promises = request.entry.map((entry: MessengerBotEntry) => {
          // Set platform origin on request entry
          entry.$type = 'facebook';
          const serverCopy = _cloneDeep(server);
          // eslint-disable-next-line @typescript-eslint/no-empty-function
          serverCopy.setResponse = async (response: FacebookMessengerResponse) => {
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

  /**
   * Sends data to the Facebook Messenger API
   * @param data - Data to be sent
   */
  async sendData<RESPONSE extends AnyObject>(
    data: UnknownObject,
  ): Promise<AxiosResponse<RESPONSE>> {
    if (!this.pageAccessToken) {
      throw new JovoError({
        message: 'Can not send message to Facebook due to a missing or empty page-access-token.',
      });
    }
    try {
      // TODO: AttachmentMessage-support
      return await axios.post<RESPONSE>(this.endpoint, data);
    } catch (error) {
      if (error.isAxiosError) {
        throw new JovoError({
          message: `Request to Facebook API failed: ${error.response?.data?.error?.message}`,
        });
      }

      throw error;
    }
  }

  private async markAsSeen(jovo: Jovo): Promise<void> {
    if (this.config.senderActions?.markSeen === false) {
      return;
    }

    await this.sendSenderAction(jovo, 'mark_seen');
  }

  private async enableTypingIndicator(jovo: Jovo) {
    if (this.config.senderActions?.typingIndicator === false) {
      return;
    }

    await this.sendSenderAction(jovo, 'typing_on');
  }

  private async disableTypingIndicator(jovo: Jovo) {
    if (this.config.senderActions?.typingIndicator === false) {
      return;
    }

    await this.sendSenderAction(jovo, 'typing_off');
  }

  private async sendSenderAction(jovo: Jovo, senderAction: SenderAction) {
    if (jovo.$platform.name !== 'FacebookMessengerPlatform') {
      return;
    }

    await this.sendData({ recipient: { id: jovo.$user.id }, sender_action: senderAction });
  }
}
