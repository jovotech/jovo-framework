import { AnyObject, App, ExtensibleConfig, Jovo, Platform } from '@jovotech/framework';
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

  mount(parent: App): void {
    super.mount(parent);
    parent.middlewareCollection.use('request.start', (jovo) => {
      return this.onRequestStart(jovo);
    });
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

  onRequestStart(jovo: Jovo): void {
    const request = jovo.$googleAssistant?.$request;
    // if it is a selection-event
    if (
      request?.intent &&
      !request?.intent?.name &&
      (request.scene?.slotFillingStatus === SlotFillingStatus.Final ||
        request.scene?.slotFillingStatus === SlotFillingStatus.Unspecified) &&
      Object.keys(request.intent?.params || {}).length &&
      request.session?.params?._GOOGLE_ASSISTANT_SELECTION_INTENT_
    ) {
      jovo.$input.intent = request.session.params._GOOGLE_ASSISTANT_SELECTION_INTENT_;
    }
  }
}
