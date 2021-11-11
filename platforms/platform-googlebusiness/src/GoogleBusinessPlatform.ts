import {
  AnyObject,
  DbPlugin,
  Extensible,
  ExtensibleConfig,
  ExtensibleInitConfig,
  Jovo,
  Platform,
  StoredElementSession,
} from '@jovotech/framework';
import { JWT, JWTInput } from 'google-auth-library';
import { v4 as uuidV4 } from 'uuid';
import { GoogleBusiness } from './GoogleBusiness';
import { GoogleBusinessDevice } from './GoogleBusinessDevice';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';
import { GoogleBusinessRequestBuilder } from './GoogleBusinessRequestBuilder';
import { GoogleBusinessResponse } from './GoogleBusinessResponse';
import { GoogleBusinessUser } from './GoogleBusinessUser';
import { GoogleBusinessOutputTemplateConverterStrategy } from './output';

export interface GoogleBusinessConfig extends ExtensibleConfig {
  serviceAccount: JWTInput;

  session?: StoredElementSession & { enabled?: never };
}
export type GoogleBusinessInitConfig = ExtensibleInitConfig<GoogleBusinessConfig> &
  Pick<GoogleBusinessConfig, 'serviceAccount'>;

export class GoogleBusinessPlatform extends Platform<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusiness,
  GoogleBusinessUser,
  GoogleBusinessDevice,
  GoogleBusinessPlatform,
  GoogleBusinessConfig
> {
  outputTemplateConverterStrategy = new GoogleBusinessOutputTemplateConverterStrategy();
  requestClass = GoogleBusinessRequest;
  jovoClass = GoogleBusiness;
  userClass = GoogleBusinessUser;
  deviceClass = GoogleBusinessDevice;
  requestBuilder = GoogleBusinessRequestBuilder;

  readonly jwtClient: JWT;

  constructor(config: GoogleBusinessInitConfig) {
    super(config);
    this.jwtClient = new JWT({
      email: this.config.serviceAccount.client_email,
      key: this.config.serviceAccount.private_key,
      scopes: ['https://www.googleapis.com/auth/businessmessages'],
    });
  }

  getDefaultConfig(): GoogleBusinessConfig {
    return {
      serviceAccount: {},
    };
  }

  mount(parent: Extensible): Promise<void> | void {
    super.mount(parent);

    // Hook into parent's middleware in order to be able to call this first and skip before other plugins are called.
    parent.middlewareCollection.use('before.request.start', (jovo) => {
      return this.beforeRequestStart(jovo);
    });
    this.middlewareCollection.use('request.start', (jovo) => {
      return this.enableDatabaseSessionStorage(jovo, this.config.session);
    });

    // Hook into parent's middleware after loading the session data from the database.
    parent.middlewareCollection.use('after.request.end', (jovo) => {
      return this.handlePotentialDuplicateMessage(jovo);
    });
  }

  isRequestRelated(request: AnyObject | GoogleBusinessRequest): boolean {
    return request.agent && request.conversationId && request.requestId;
  }

  isResponseRelated(response: AnyObject | GoogleBusinessResponse): boolean {
    return response.messageId && response.representative;
  }

  finalizeResponse(
    response: GoogleBusinessResponse[] | GoogleBusinessResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    googleBusiness: GoogleBusiness,
  ):
    | GoogleBusinessResponse[]
    | Promise<GoogleBusinessResponse>
    | Promise<GoogleBusinessResponse[]>
    | GoogleBusinessResponse {
    if (Array.isArray(response)) {
      response.forEach((responseItem) => {
        responseItem.messageId = uuidV4();
      });
    } else {
      response.messageId = uuidV4();
    }
    return response;
  }

  private async handlePotentialDuplicateMessage(jovo: Jovo) {
    if (!jovo.$googleBusiness) {
      return;
    }
    const messageId =
      jovo.$googleBusiness.$request.message?.messageId ||
      jovo.$googleBusiness.$request.suggestionResponse?.message?.match?.(/messages[/](.*)/)?.[1];
    if (!messageId) {
      return;
    }
    const processedMessages = jovo.$session.data._GOOGLE_BUSINESS_PROCESSED_MESSAGES_ || [];
    // message was handled already
    if (processedMessages.includes(messageId)) {
      jovo.$handleRequest.stopMiddlewareExecution();
      return jovo.$handleRequest.server.setResponse({});
    }
    processedMessages.push(messageId);
    jovo.$session.data._GOOGLE_BUSINESS_PROCESSED_MESSAGES_ = processedMessages;

    if (!jovo.$user.id) {
      return;
    }

    const dbPlugins = Object.values(jovo.$handleRequest.plugins).filter(
      (plugin) => plugin instanceof DbPlugin,
    ) as DbPlugin[];

    // Immediately save the data into the database, so that other simultaneous or delayed requests can already check if the message is being handled or was handled already.
    // If some time-consuming API calls were made during the handling, the saving of the processed message would only take place after those calls which could cause a delay.
    // This delay could then cause the persisting to happen after other requests have already checked if the message was handled.
    return Promise.all(
      dbPlugins.map((dbPlugin) => {
        return dbPlugin.saveData(jovo.$user.id as string, jovo);
      }),
    );
  }

  private beforeRequestStart(jovo: Jovo): void {
    // if the request is a typing-indicator-request or a receipt-request, just ignore it and send 200 to not get it sent multiple times
    if (jovo.$googleBusiness?.$request?.userStatus || jovo.$googleBusiness?.$request?.receipts) {
      jovo.$response = {} as GoogleBusinessResponse;
      jovo.$handleRequest.stopMiddlewareExecution();
    }
  }
}
