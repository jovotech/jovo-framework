import {
  Capability,
  EntityMap,
  InputType,
  InputTypeLike,
  JovoInput,
  JovoRequest,
  JovoSession,
  UnknownObject,
} from '@jovotech/framework';
import { AlexaCapability, AlexaCapabilityType } from './AlexaDevice';
import { DYNAMIC_ENTITY_MATCHES_PREFIX, STATIC_ENTITY_MATCHES_PREFIX } from './constants';
import { AlexaEntity, Context, Request, Session } from './interfaces';
import { ResolutionPerAuthority, ResolutionPerAuthorityStatusCode, Slot } from './output';

export const ALEXA_REQUEST_TYPE_TO_INPUT_TYPE_MAP: Record<string, InputTypeLike> = {
  'LaunchRequest': InputType.Launch,
  'IntentRequest': InputType.Intent,
  'SessionEndedRequest': InputType.End,
  'System.ExceptionEncountered': InputType.Error,
};

export class AlexaRequest extends JovoRequest {
  version?: string;
  context?: Context;
  session?: Session;
  request?: Request;

  getLocale(): string | undefined {
    return this.request?.locale;
  }

  getIntent(): JovoInput['intent'] {
    return this.request?.intent?.name;
  }

  setIntent(intent: string): void {
    if (!this.request) {
      return;
    }

    if (!this.request.intent) {
      this.request.intent = { name: intent };
    } else {
      this.request.intent.name = intent;
    }
  }

  getEntities(): EntityMap<AlexaEntity> | undefined {
    const slots: Record<string, Slot> = {
      ...(this.request?.intent?.slots || {}),
      ...(this.request?.apiRequest?.slots || {}),
    };

    if (!Object.keys(slots).length) {
      return;
    }

    return Object.keys(slots).reduce((entityMap: EntityMap<AlexaEntity>, slotKey: string) => {
      const entity: AlexaEntity = {
        native: slots[slotKey],
      };
      if (slots[slotKey].value) {
        entity.value = slots[slotKey].value;
        entity.resolved = slots[slotKey].value;
      }

      const modifyEntityByAuthorityResolutions = (
        resolutionsPerAuthority: ResolutionPerAuthority[],
      ) => {
        resolutionsPerAuthority.forEach((resolutionPerAuthority) => {
          const { name, id } = resolutionPerAuthority.values[0].value;
          entity.resolved = name;
          entity.id = id || name;
        });
      };

      // check static entities first
      modifyEntityByAuthorityResolutions(this.getStaticEntityMatches(slotKey));

      // dynamic entities have a higher priority
      modifyEntityByAuthorityResolutions(this.getDynamicEntityMatches(slotKey));

      entityMap[slotKey] = entity;
      return entityMap;
    }, {});
  }

  getStaticEntityMatches(slotKey: string): ResolutionPerAuthority[] {
    return this.getEntityResolutions(slotKey, STATIC_ENTITY_MATCHES_PREFIX);
  }

  getDynamicEntityMatches(slotKey: string): ResolutionPerAuthority[] {
    return this.getEntityResolutions(slotKey, DYNAMIC_ENTITY_MATCHES_PREFIX);
  }

  private getEntityResolutions(slotKey: string, prefix: string): ResolutionPerAuthority[] {
    return [
      ...(this.request?.intent?.slots?.[slotKey]?.resolutions?.resolutionsPerAuthority || []),
      ...(this.request?.apiRequest?.slots?.[slotKey]?.resolutions?.resolutionsPerAuthority || []),
    ].filter(
      (authorityResolution) =>
        authorityResolution.status.code === ResolutionPerAuthorityStatusCode.SuccessMatch &&
        authorityResolution.authority.startsWith(prefix),
    );
  }

  getInputType(): InputTypeLike | undefined {
    return this.request?.type
      ? ALEXA_REQUEST_TYPE_TO_INPUT_TYPE_MAP[this.request.type] || this.request.type
      : undefined;
  }

  setLocale(locale: string): void {
    if (!this.request) {
      return;
    }

    this.request.locale = locale;
  }

  getInputText(): JovoInput['text'] {
    return;
  }

  getInputAudio(): JovoInput['audio'] {
    return;
  }

  getSessionData(): UnknownObject | undefined {
    return this.session?.attributes;
  }

  setSessionData(session: JovoSession): void {
    if (!this.session) {
      return;
    }

    this.session.attributes = session;
  }

  getSessionId(): string | undefined {
    return this.session?.sessionId;
  }

  isNewSession(): boolean | undefined {
    return this.session?.new;
  }

  // platform-specific
  isAplSupported(): boolean {
    return !!this.context?.System?.device?.supportedInterfaces?.['Alexa.Presentation.APL'];
  }

  getUserId(): string | undefined {
    return this.session?.user?.userId;
  }

  setUserId(userId: string): void {
    if (!this.session) {
      // TODO: What to do here?
      return;
    }

    if (!this.session.user) {
      this.session.user = { userId: userId, accessToken: '', permissions: { consentToken: '' } };
    }

    this.session.user.userId = userId;
  }

  getApiEndpoint(): string {
    return this.context!.System.apiEndpoint;
  }

  getApiAccessToken(): string {
    return this.context!.System.apiAccessToken;
  }

  getDeviceCapabilities(): AlexaCapabilityType[] | undefined {
    const supportedInterfaces = this.context?.System?.device?.supportedInterfaces;
    if (!supportedInterfaces) {
      return;
    }
    const capabilities: AlexaCapabilityType[] = [Capability.Audio];
    if (supportedInterfaces.AudioPlayer) {
      capabilities.push(Capability.LongformAudio);
    }
    if (supportedInterfaces['Alexa.Presentation.APL']) {
      capabilities.push(Capability.Screen, AlexaCapability.Apl);
    }
    return capabilities;
  }
}
