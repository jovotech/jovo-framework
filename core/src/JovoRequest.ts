import { EntityMap, NluData, SessionData } from './interfaces';
import { JovoRequestType } from './Jovo';

export abstract class JovoRequest {
  [key: string]: unknown;


  abstract getEntities(): EntityMap | undefined;

  abstract getIntentName(): string | undefined;

  abstract getLocale(): string | undefined;

  abstract getRawText(): string | undefined;

  abstract getRequestType(): JovoRequestType | undefined;

  abstract getSessionData(): SessionData | undefined;

  getNluData(): NluData | undefined {
    const intentName = this.getIntentName();
    const entities = this.getEntities();
    return {
      intent: intentName ? { name: intentName } : undefined,
      entities,
    };
  }
}
