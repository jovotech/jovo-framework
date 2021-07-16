import {
  AnyObject,
  App,
  ExtensibleConfig,
  HandleRequest,
  InternalIntent,
  Jovo,
  Platform,
  RequestType,
} from '@jovotech/framework';
import {
  GoogleAssistantOutputTemplateConverterStrategy,
  GoogleAssistantResponse,
  Session,
} from '@jovotech/output-googleassistant';
import { GoogleAction } from './GoogleAction';
import { GoogleAssistantRepromptComponent } from './GoogleAssistantRepromptComponent';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantUser } from './GoogleAssistantUser';
import _mergeWith from 'lodash.mergewith';

export interface GoogleAssistantConfig extends ExtensibleConfig {}

export class GoogleAssistant extends Platform<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAction,
  GoogleAssistantConfig
> {
  outputTemplateConverterStrategy = new GoogleAssistantOutputTemplateConverterStrategy();
  requestClass = GoogleAssistantRequest;
  jovoClass = GoogleAction;
  userClass = GoogleAssistantUser;

  getDefaultConfig(): GoogleAssistantConfig {
    return {};
  }

  install(parent: App): void {
    super.install(parent);
    parent.middlewareCollection.use('before.request', this.beforeRequest);
  }

  initialize(parent: App): void {
    parent.use(GoogleAssistantRepromptComponent);
  }

  isRequestRelated(request: AnyObject | GoogleAssistantRequest): boolean {
    return request.user && request.session && request.handler && request.device;
  }

  isResponseRelated(response: AnyObject | GoogleAssistantResponse): boolean {
    return response.user && response.session && response.prompt;
  }

  finalizeResponse(
    response: GoogleAssistantResponse,
    googleAction: GoogleAction,
  ): GoogleAssistantResponse | Promise<GoogleAssistantResponse> {
    const requestSession = googleAction.$request.session || {};
    const responseSession = response.session || {};
    response.session = _mergeWith(
      { id: '', languageCode: '', ...requestSession },
      responseSession,
      { params: { ...googleAction.$session } },
      (objValue, srcValue) => {
        if (typeof objValue === 'string' && typeof srcValue === 'string') {
          return objValue ? objValue : srcValue;
        }
      },
    );
    return response;
  }

  beforeRequest: (handleRequest: HandleRequest, jovo: Jovo) => void = (
    handleRequest: HandleRequest,
    jovo: Jovo,
  ) => {
    // TODO this is just a workaround until $input is implemented and used instead of the intentName for routing
    if (jovo.$type.type === RequestType.Launch) {
      jovo.$nlu.intent = {
        name: InternalIntent.Launch,
      };
    }
  };
}
