import { UnknownObject } from './index';
import { EntityMap, NluData } from './interfaces';
import { JovoRequestType } from './Jovo';
import { JovoSession } from './JovoSession';

export abstract class JovoRequest {
  [key: string]: unknown;

  abstract getEntities(): EntityMap | undefined;

  abstract getIntentName(): string | undefined;

  abstract getLocale(): string | undefined;

  abstract getRawText(): string | undefined;

  abstract getRequestType(): JovoRequestType | undefined;

  abstract getSessionId(): string | undefined;

  abstract getSessionData(): UnknownObject | undefined;

  abstract isNewSession(): boolean | undefined;

  getSession(): Partial<JovoSession> | undefined {
    const sessionId = this.getSessionId();
    const sessionData = this.getSessionData();
    const isNewSession = this.isNewSession();
    return !sessionId && !sessionData && typeof isNewSession === 'undefined'
      ? undefined
      : {
          // TODO determine whether data should be emptied when session is new
          ...(isNewSession ? {} : sessionData || {}),
          id: sessionId,
          isNew: isNewSession,
        };
  }

  getNluData(): NluData | undefined {
    const nluData: NluData = {};
    const intentName = this.getIntentName();
    const entities = this.getEntities();
    if (intentName) {
      nluData.intent = {
        name: intentName,
      };
    }
    if (entities) {
      nluData.entities = entities;
    }
    return nluData;
  }
}
