import {
  AnyObject,
  App,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Platform,
} from '@jovotech/framework';
import {
  GoogleAssistantOutputTemplateConverterStrategy,
  GoogleAssistantResponse,
} from '@jovotech/output-googleassistant';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantRepromptComponent } from './GoogleAssistantRepromptComponent';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantUser } from './GoogleAssistantUser';
import { GoogleAssistantDevice } from './GoogleAssistantDevice';

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
    // TODO: check logic
    const requestSession = googleAssistant.$request.session;
    if (requestSession) {
      if (!response.session) {
        response.session = { ...requestSession, params: { ...googleAssistant.$session } };
      } else {
        response.session.params = { ...requestSession.params, ...googleAssistant.$session };
      }
    }
    return response;
  }

  beforeRequest: (handleRequest: HandleRequest, jovo: Jovo) => void = (
    handleRequest: HandleRequest,
    jovo: Jovo,
  ) => {
    // if the request is a no-input-request and a state exists, add the reprompt-component to the top
    const intentName = jovo.$googleAssistant?.$request?.intent?.name;
    if (
      intentName &&
      [
        'actions.intent.NO_INPUT_1',
        'actions.intent.NO_INPUT_2',
        'actions.intent.NO_INPUT_FINAL',
      ].includes(intentName) &&
      jovo.$state
    ) {
      jovo.$state.push({
        component: 'GoogleAssistantRepromptComponent',
      });
    }
  };
}
