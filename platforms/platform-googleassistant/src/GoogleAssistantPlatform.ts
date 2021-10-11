import { AnyObject, App, ExtensibleConfig, Jovo, Platform } from '@jovotech/framework';
import {
  GoogleAssistantOutputTemplateConverterStrategy,
  GoogleAssistantResponse,
} from '@jovotech/output-googleassistant';
import _mergeWith from 'lodash.mergewith';
import { v4 as uuidV4 } from 'uuid';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantDevice } from './GoogleAssistantDevice';
import { GoogleAssistantRepromptComponent } from './GoogleAssistantRepromptComponent';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantRequestBuilder } from './GoogleAssistantRequestBuilder';
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
  requestBuilder = GoogleAssistantRequestBuilder;

  getDefaultConfig(): GoogleAssistantConfig {
    return {};
  }

  mount(parent: App): void {
    super.mount(parent);

    parent.middlewareCollection.use('before.request.start', (jovo) => {
      if (jovo.$googleAssistant?.$request.intent?.name === 'actions.intent.HEALTH_CHECK') {
        jovo.$handleRequest.stopMiddlewareExecution();
        return jovo.$handleRequest.server.setResponse({});
      }
    });

    this.middlewareCollection.use('request.start', (jovo) => {
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

    if (googleAssistant.$request.user) {
      response.user = {
        ...googleAssistant.$request.user,
      };
    }

    if (response.scene && googleAssistant.$request.scene?.name) {
      response.scene.name = googleAssistant.$request.scene.name;
    }
    return response;
  }

  onRequestStart(jovo: Jovo): void {
    const user = jovo.$googleAssistant?.$user;
    // if the user is linked and has no user id, generate one
    if (user && user.isVerified() && !user.id) {
      user.setId(uuidV4());
    }

    const request = jovo.$googleAssistant?.$request;
    // if it is a selection-event
    if (
      request?.intent &&
      !request?.intent?.name &&
      !!request.scene?.slotFillingStatus &&
      Object.keys(request.intent?.params || {}).length &&
      request.session?.params?._GOOGLE_ASSISTANT_SELECTION_INTENT_
    ) {
      jovo.$input.intent = request.session.params._GOOGLE_ASSISTANT_SELECTION_INTENT_;
      delete request.session.params._GOOGLE_ASSISTANT_SELECTION_INTENT_;
    }
  }
}
