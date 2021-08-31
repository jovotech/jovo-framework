import {
  Entity,
  EntityMap,
  InputType,
  InputTypeLike,
  JovoInput,
  JovoRequest,
  UnknownObject,
} from '@jovotech/framework';
import { ResolutionPerAuthorityStatusCode } from '@jovotech/output-alexa';
import { DYNAMIC_ENTITY_MATCHES_PREFIX, STATIC_ENTITY_MATCHES_PREFIX } from './constants';
import { AuthorityResolution, Context, Request, Session } from './interfaces';

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

  getEntities(): EntityMap | undefined {
    const slots = this.request?.intent?.slots;
    if (!slots) return;
    return Object.keys(slots).reduce((entityMap: EntityMap, slotKey: string) => {
      const entity: Entity = {
        alexaSkill: slots[slotKey],
      };
      if (slots[slotKey].value) {
        entity.value = slots[slotKey].value;
        entity.key = slots[slotKey].value;
      }

      const modifyEntityByAuthorityResolutions = (authorityResolutions: AuthorityResolution[]) => {
        authorityResolutions.forEach((authorityResolution) => {
          entity.key = authorityResolution.values[0].value.name;
          entity.id = authorityResolution.values[0].value.id;
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

  getStaticEntityMatches(slotKey: string): AuthorityResolution[] {
    return this.getEntityResolutions(slotKey, STATIC_ENTITY_MATCHES_PREFIX);
  }

  getDynamicEntityMatches(slotKey: string): AuthorityResolution[] {
    return this.getEntityResolutions(slotKey, DYNAMIC_ENTITY_MATCHES_PREFIX);
  }

  private getEntityResolutions(slotKey: string, startsWith: string): AuthorityResolution[] {
    return (
      this.request?.intent?.slots?.[slotKey]?.resolutions?.resolutionsPerAuthority || []
    ).filter(
      (authorityResolution) =>
        authorityResolution.status.code === ResolutionPerAuthorityStatusCode.SuccessMatch &&
        authorityResolution.authority.startsWith(startsWith),
    );
  }

  getInputType(): InputTypeLike | undefined {
    return this.request?.type
      ? ALEXA_REQUEST_TYPE_TO_INPUT_TYPE_MAP[this.request.type] || this.request.type
      : undefined;
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

  getApiEndpoint(): string {
    return this.context!.System.apiEndpoint;
  }

  getApiAccessToken(): string {
    return this.context!.System.apiAccessToken;
  }
}
