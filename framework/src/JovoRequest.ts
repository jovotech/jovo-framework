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

  abstract getSession(): JovoSession | undefined;

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
