import {
  App,
  DeepPartial,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Platform,
} from '@jovotech/framework';
import {
  GoogleBusinessOutputTemplateConverterStrategy,
  GoogleBusinessResponse,
} from '@jovotech/output-googlebusiness';
import { JWT } from 'google-auth-library';
import { v4 as uuidV4 } from 'uuid';
import { GoogleBusinessBot } from './GoogleBusinessBot';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';
import { GoogleBusinessUser } from './GoogleBusinessUser';
import { GoogleServiceAccount } from './interfaces';

export interface GoogleBusinessConfig extends ExtensibleConfig {
  serviceAccount: GoogleServiceAccount;
}
export type GoogleBusinessInitConfig = DeepPartial<GoogleBusinessConfig> &
  Pick<GoogleBusinessConfig, 'serviceAccount'>;

export class GoogleBusiness extends Platform<
  GoogleBusinessRequest,
  GoogleBusinessResponse,
  GoogleBusinessBot,
  GoogleBusinessConfig
> {
  outputTemplateConverterStrategy = new GoogleBusinessOutputTemplateConverterStrategy();
  requestClass = GoogleBusinessRequest;
  jovoClass = GoogleBusinessBot;
  userClass = GoogleBusinessUser;

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

  mount(parent: HandleRequest) {
    super.mount(parent);

    parent.middlewareCollection.use('before.request', this.beforeRequest);
  }

  isRequestRelated(request: Record<string, any> | GoogleBusinessRequest): boolean {
    return request.agent && request.conversationId && request.requestId;
  }

  isResponseRelated(response: Record<string, any> | GoogleBusinessResponse): boolean {
    return response.messageId && response.representative;
  }

  finalizeResponse(
    response: GoogleBusinessResponse[] | GoogleBusinessResponse,
    jovo: GoogleBusinessBot,
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

  private beforeRequest = (handleRequest: HandleRequest, googleBusinessBot: GoogleBusinessBot) => {
    // if the request is a typing-indicator-request or a receipt-request, just ignore it and send 200 to not get it sent multiple times
    if (googleBusinessBot.$request.userStatus || googleBusinessBot.$request.receipts) {
      googleBusinessBot.$response = {} as GoogleBusinessResponse;
      handleRequest.stopMiddlewareExecution();
    }
  };
}
