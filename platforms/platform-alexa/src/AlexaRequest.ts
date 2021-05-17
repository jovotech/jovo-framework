import {
  Entity,
  EntityMap,
  JovoRequest,
  JovoRequestType,
  JovoSession,
  RequestType,
} from '@jovotech/framework';
import { Context, Request, Session } from './interfaces';

export class AlexaRequest extends JovoRequest {
  version?: string;
  context?: Context;
  session?: Session;
  request?: Request;

  getEntities(): EntityMap | undefined {
    const slots = this.request?.intent?.slots;
    if (!slots) return;
    const slotKeys = Object.keys(slots);

    const entities: EntityMap = {};
    for (let i = 0, len = slotKeys.length; i < len; i++) {
      const slotKey = slotKeys[i];
      const entity: Entity = {
        name: slotKey,
        alexaSkill: slots[slotKey],
      };
      if (slots[slotKey].value) {
        entity.value = slots[slotKey].value;
        entity.key = slots[slotKey].value;
      }

      // TODO fully implement, it's not complete!
      // entity-matches are missing (static and dynamic)

      entities[slotKeys[i]] = entity;
    }

    return entities;
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

  getSession(): JovoSession | undefined {
    return !this.session?.attributes && !this.session?.sessionId
      ? undefined
      : ({ ...(this.session?.attributes || {}), id: this.session.sessionId } as JovoSession);
  }
}
