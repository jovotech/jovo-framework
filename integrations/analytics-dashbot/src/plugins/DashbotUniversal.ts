import { QuickReply, SpeechMessage, TextMessage } from '@jovotech/output';
import {
  Jovo,
  UnknownObject,
  Intent,
  JovoResponse,
  JovoRequest,
  OutputTemplate,
  Platform,
  MessageValue,
  QuickReplyValue,
} from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from './DashbotAnalyticsPlugin';

declare module '../interfaces' {
  interface DashbotAnalyticsConfigPlugins {
    universal?: DashbotAnalyticsPluginConfig;
  }
}

export interface DashbotUniversalInput {
  name: string;
  value: string;
}

export interface DashbotUniversalIntent {
  name: string;
  inputs: DashbotUniversalInput[];
}

export interface DashbotUniversalImage {
  url: string;
}

export interface DashbotUniversalButton {
  id?: string;
  label?: string;
  value?: string;
}

export interface DashbotUniversalPostback {
  buttonClick: {
    buttonId: string;
  };
}

export interface DashbotUniversalLog extends UnknownObject {
  text: string;
  userId: string;
  intent?: DashbotUniversalIntent;
  images?: DashbotUniversalImage[];
  buttons?: DashbotUniversalButton[];
  postback?: DashbotUniversalPostback;
  platformJson?: JovoRequest | JovoResponse;
  sessionId?: string;
}

export class DashbotUniversal extends DashbotAnalyticsPlugin {
  get id(): string {
    return 'universal';
  }

  async trackRequest(jovo: Jovo, url: string): Promise<void> {
    const text: string =
      jovo.$input.text || this.getIntentName(jovo.$input.intent) || jovo.$input.type || '';

    const requestLog: DashbotUniversalLog = {
      text,
      userId: jovo.$user.id || '',
      platformJson: jovo.$request,
      sessionId: jovo.$session.id || '',
    };

    const intentName: string = this.getIntentName(jovo.$input.intent) || jovo.$input.type;
    const inputs: DashbotUniversalInput[] = Object.entries(jovo.$input.entities || []).map(
      ([key, entry]) => ({
        name: key,
        value: entry?.value || '',
      }),
    );

    requestLog.intent = { name: intentName, inputs };

    await this.sendDashbotRequest(url, requestLog);
  }

  async trackResponse(jovo: Jovo, url: string): Promise<void> {
    if (!jovo.$response) {
      return;
    }

    const responses: JovoResponse[] = Array.isArray(jovo.$response)
      ? jovo.$response
      : [jovo.$response];

    for (const response of responses) {
      // @ts-ignore
      const responseLog: DashbotUniversalRequestLog = {};

      await this.sendDashbotRequest(url, responseLog);
    }
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
