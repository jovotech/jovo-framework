import {
  Jovo,
  JovoRequest,
  JovoResponse,
  MessageValue,
  Platform,
  QuickReplyValue,
  UnknownObject,
} from '@jovotech/framework';
import { DashbotAnalyticsPlugin } from './DashbotAnalyticsPlugin';

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
  readonly id: string = 'universal';

  async trackRequest(jovo: Jovo, url: string): Promise<void> {
    const text: string =
      jovo.$input.getText() || jovo.$input.getIntentName() || jovo.$input.type || '';

    const requestLog: DashbotUniversalLog = {
      text,
      userId: jovo.$user.id || '',
      platformJson: jovo.$request,
      sessionId: jovo.$session.id || '',
    };

    const intentName: string = jovo.$input.getIntentName() || jovo.$input.type;
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
    for (const output of jovo.$output) {
      // Since we iterate through each output respectively,
      // it's safe to assume that the response is an object
      const strategy = (jovo.$platform as Platform).outputTemplateConverterStrategy;
      const normalizedOutput = strategy.normalizeOutput(output);
      const response: JovoResponse = (
        jovo.$platform as Platform
      ).outputTemplateConverterStrategy.toResponse(normalizedOutput) as JovoResponse;

      const responseLog: DashbotUniversalLog = {
        text: this.getOutputText(output.message),
        userId: jovo.$user.id || '',
        platformJson: response,
        buttons: this.getButtons(output.quickReplies),
        sessionId: jovo.$session.id || '',
      };

      await this.sendDashbotRequest(url, responseLog);
    }
  }

  canHandle(): boolean {
    return true;
  }

  private getButtons(quickReplies?: QuickReplyValue[]): DashbotUniversalButton[] {
    if (!quickReplies || !quickReplies.length) {
      return [];
    }

    return quickReplies.map((quickReply: QuickReplyValue) => {
      if (typeof quickReply === 'string') {
        return { label: quickReply };
      } else {
        return { label: quickReply.text };
      }
    });
  }

  private getOutputText(message: MessageValue | MessageValue[] | undefined): string {
    if (!message) {
      return '';
    }
    message = Array.isArray(message) ? this.getRandomElement(message) : message;
    return (typeof message === 'object' ? message.text || message.speech : message) || '';
  }

  private getRandomElement<T>(array: T[]): T | undefined {
    const randomIndex = Math.floor(Math.random() * array.length);
    return array[randomIndex];
  }
}
