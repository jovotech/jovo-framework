import {
  AnyObject,
  App,
  EntityMap,
  ExtensibleConfig,
  HandleRequest,
  InternalIntent,
  Platform,
  RequestType,
} from '@jovotech/framework';
import {
  GoogleAssistantOutputTemplateConverterStrategy,
  GoogleAssistantResponse,
  SlotFillingStatus,
} from '@jovotech/output-googleassistant';
import _mergeWith from 'lodash.mergewith';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantDevice } from './GoogleAssistantDevice';
import { GoogleAssistantRepromptComponent } from './GoogleAssistantRepromptComponent';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantUser } from './GoogleAssistantUser';

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
    if (response.scene && googleAssistant.$request.scene?.name) {
      response.scene.name = googleAssistant.$request.scene.name;
    }
    return response;
  }

  beforeRequest = (handleRequest: HandleRequest, googleAssistant: GoogleAssistant) => {
    if (googleAssistant.$type.type === RequestType.Launch) {
      googleAssistant.$nlu.intent = {
        name: InternalIntent.Launch,
      };
    }
    // TODO check condition
    // A request on selection has no intent, should have FINAl slotFillingStatus and at least one entry in intent.params
    if (
      googleAssistant.$request.intent &&
      !googleAssistant.$request.intent?.name &&
      googleAssistant.$request.scene?.slotFillingStatus === SlotFillingStatus.Final &&
      Object.keys(googleAssistant.$request.intent?.params || {}).length &&
      googleAssistant.$request.session?.params?._GOOGLE_ASSISTANT_SELECTION_INTENT_
    ) {
      if (!googleAssistant.$nlu) {
        googleAssistant.$nlu = {};
      }
      if (!googleAssistant.$nlu.intent) {
        googleAssistant.$nlu.intent = { name: '' };
      }
      // set intent
      googleAssistant.$nlu.intent.name =
        googleAssistant.$request.session.params._GOOGLE_ASSISTANT_SELECTION_INTENT_;
    }
  };
}
