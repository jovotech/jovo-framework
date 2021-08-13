import { JovoInput, UnknownObject } from './index';
import { JovoSession } from './JovoSession';

export abstract class JovoRequest {
  [key: string]: unknown;

  abstract getInput(): JovoInput;

  abstract getLocale(): string | undefined;

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
}
