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
} from '@jovotech/output-googleassistant';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantDevice } from './GoogleAssistantDevice';
import { GoogleAssistantRepromptComponent } from './GoogleAssistantRepromptComponent';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantUser } from './GoogleAssistantUser';
import _mergeWith from 'lodash.mergewith';

export interface GoogleAssistantConfig extends ExtensibleConfig {}

export class GoogleAssistantPlatform extends Platform<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAssistant,
  GoogleAssistantUser,
  GoogleAssistantDevice,
  GoogleAssistantPlatform,
  GoogleAssistantConfig
> {
  outputTemplateConverterStrategy = new GoogleAssistantOutputTemplateConverterStrategy();
  requestClass = GoogleAssistantRequest;
  jovoClass = GoogleAssistant;
  userClass = GoogleAssistantUser;
  deviceClass = GoogleAssistantDevice;

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
    googleAssistant: GoogleAssistant,
  ): GoogleAssistantResponse | Promise<GoogleAssistantResponse> {
    const requestSession = googleAssistant.$request.session || {};
    const responseSession = response.session || {};
    response.session = _mergeWith(
      { id: '', languageCode: '', ...requestSession },
      responseSession,
      { params: { ...googleAssistant.$session } },
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
