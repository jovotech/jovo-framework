import {
  Entity,
  EntityMap,
  JovoRequest,
  JovoRequestType,
  RequestType,
  UnknownObject,
} from '@jovotech/framework';
import { ResolutionPerAuthorityStatusCode } from '@jovotech/output-alexa';
import { DYNAMIC_ENTITY_MATCHES_PREFIX, STATIC_ENTITY_MATCHES_PREFIX } from './constants';
import { AuthorityResolution, Context, Request, Session } from './interfaces';

export class AlexaRequest extends JovoRequest {
  version?: string;
  context?: Context;
  session?: Session;
  request?: Request;

  getEntities(): EntityMap | undefined {
    const slots = this.request?.intent?.slots;
    if (!slots) return;
    return Object.keys(slots).reduce((entityMap: EntityMap, slotKey: string) => {
      const entity: Entity = {
        name: slotKey,
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

  getIntentName(): string | undefined {
    return this.request?.intent?.name;
  }

  getLocale(): string | undefined {
    return this.request?.locale;
  }

  getRawText(): string | undefined {
    return;
  }

  getRequestType(): JovoRequestType | undefined {
    const requestTypeMap: Record<string, JovoRequestType> = {
      'LaunchRequest': { type: RequestType.Launch },
      'IntentRequest': { type: RequestType.Intent },
      'SessionEndedRequest': { type: RequestType.End, subType: this.request?.reason },
      'System.ExceptionEncountered': { type: RequestType.OnError },
    };
    return this.request?.type ? requestTypeMap[this.request?.type] : undefined;
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

  isAplSupported(): boolean {
    return !!this.context?.System?.device?.supportedInterfaces?.['Alexa.Presentation.APL'];
  }
}
