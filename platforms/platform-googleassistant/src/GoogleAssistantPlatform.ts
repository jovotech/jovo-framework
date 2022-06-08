import { AnyObject, App, Jovo, Platform, PlatformConfig } from '@jovotech/framework';
import _mergeWith from 'lodash.mergewith';
import { v4 as uuidV4 } from 'uuid';
import { GoogleAssistant } from './GoogleAssistant';
import { GoogleAssistantDevice } from './GoogleAssistantDevice';
import { GoogleAssistantRepromptComponent } from './GoogleAssistantRepromptComponent';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';
import { GoogleAssistantRequestBuilder } from './GoogleAssistantRequestBuilder';
import { GoogleAssistantResponse } from './GoogleAssistantResponse';
import { GoogleAssistantUser } from './GoogleAssistantUser';
import { GoogleAssistantOutputTemplateConverterStrategy } from './output';

export interface GoogleAssistantConfig extends PlatformConfig {}

export class GoogleAssistantPlatform extends Platform<
  GoogleAssistantRequest,
  GoogleAssistantResponse,
  GoogleAssistant,
  GoogleAssistantUser,
  GoogleAssistantDevice,
  GoogleAssistantPlatform,
  GoogleAssistantConfig
> {
  readonly id: string = 'googleAssistant';
  readonly outputTemplateConverterStrategy = new GoogleAssistantOutputTemplateConverterStrategy();
  readonly requestClass = GoogleAssistantRequest;
  readonly jovoClass = GoogleAssistant;
  readonly userClass = GoogleAssistantUser;
  readonly deviceClass = GoogleAssistantDevice;
  readonly requestBuilder = GoogleAssistantRequestBuilder;

  getDefaultConfig(): GoogleAssistantConfig {
    return {};
  }

  mount(parent: App): void {
    super.mount(parent);

    parent.middlewareCollection.use('before.request.start', (jovo) => {
      if (jovo.$googleAssistant?.$request.intent?.name === 'actions.intent.HEALTH_CHECK') {
        jovo.$handleRequest.stopMiddlewareExecution();
        return jovo.$handleRequest.server.setResponse({
          prompt: { override: true, firstSimple: { speech: 'ok', text: '' } },
        });
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
        // Replaces full array with the value furthest to the right. No concatenation of array values.
        if (Array.isArray(objValue) && Array.isArray(srcValue)) {
          return srcValue;
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
