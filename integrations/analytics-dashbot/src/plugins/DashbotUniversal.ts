import {
  Jovo,
  JovoRequest,
  JovoUser,
  JovoDevice,
  UnknownObject,
  Platform,
  Intent,
} from '@jovotech/framework';
import { JovoResponse } from '@jovotech/output';
import { DashbotAnalyticsPlugin } from '../interfaces';

export interface DashbotUniversalIntent {
  name: string;
  inputs: { name: string; value: string }[];
}

export interface DashbotUniversalRequest extends UnknownObject {
  text: string;
  userId: string;
  intent?: DashbotUniversalIntent;
  images?: UnknownObject[];
  buttons?: UnknownObject[];
  postback?: UnknownObject;
  platformJson?: UnknownObject;
}

export class DashbotUniversal implements DashbotAnalyticsPlugin {
  readonly id: string = 'universal' as const;

  createRequestLog(jovo: Jovo): DashbotUniversalRequest {
    const text: string | undefined =
      jovo.$input.text || this.getIntentName(jovo.$input.intent) || jovo.$input.type;
    console.log(text);

    if (!text) {
      // TODO: What to do here?
      throw new Error('No input text available!');
    }

    const requestLog: DashbotUniversalRequest = {
      text,
      userId: jovo.$user.id || '',
      platformJson: {
        request: jovo.$server.getRequestObject(),
        input: jovo.$input,
      },
    };

    const intentName: string = this.getIntentName(jovo.$input.intent) || jovo.$input.type;

    // TODO: Inputs!
    requestLog.intent = { name: intentName, inputs: [] };

    return requestLog;
  }

  createResponseLog(jovo: Jovo): DashbotUniversalRequest {
    const responseLog: DashbotUniversalRequest = {
      text: 'Response',
      userId: jovo.$user.id || '',
    };

    return responseLog;
  }

  canHandle(): boolean {
    return true;
  }

  private getIntentName(intent?: string | Intent): string | undefined {
    if (!intent) {
      return;
    }

    return typeof intent === 'string' ? intent : (intent as Intent).name;
  }
}
