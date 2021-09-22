import {
  AnyObject,
  Extensible,
  ExtensibleConfig,
  ExtensibleInitConfig,
  Jovo,
  Platform,
  StoredElementSession,
} from '@jovotech/framework';
import {
  GoogleBusinessOutputTemplateConverterStrategy,
  GoogleBusinessResponse,
} from '@jovotech/output-googlebusiness';
import { JWT, JWTInput } from 'google-auth-library';
import { v4 as uuidV4 } from 'uuid';
import { GoogleBusiness } from './GoogleBusiness';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';
import { GoogleBusinessUser } from './GoogleBusinessUser';
import { GoogleBusinessDevice } from './GoogleBusinessDevice';
import { GoogleBusinessRequestBuilder } from './GoogleBusinessRequestBuilder';

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

    // hook into parent's middleware in order to be able to call this first and skip before other plugins are called.
    parent.middlewareCollection.use('before.request.start', (jovo) => {
      return this.beforeRequestStart(jovo);
    });
    this.middlewareCollection.use('request.start', (jovo) => {
      return this.enableDatabaseSessionStorage(jovo, this.config.session);
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

  private beforeRequestStart(jovo: Jovo): void {
    // if the request is a typing-indicator-request or a receipt-request, just ignore it and send 200 to not get it sent multiple times
    if (jovo.$googleBusiness?.$request?.userStatus || jovo.$googleBusiness?.$request?.receipts) {
      jovo.$response = {} as GoogleBusinessResponse;
      jovo.$handleRequest.stopMiddlewareExecution();
    }
  }
}
