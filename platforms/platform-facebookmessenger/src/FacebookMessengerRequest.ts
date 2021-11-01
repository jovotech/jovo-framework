import {
  EntityMap,
  InputType,
  InputTypeLike,
  JovoInput,
  JovoRequest,
  UnknownObject,
} from '@jovotech/framework';

import { FACEBOOK_LAUNCH_PAYLOAD } from '.';
import { FacebookMessengerCapabilityType } from './FacebookMessengerDevice';
import { MessagingData } from './interfaces';

export class FacebookMessengerRequest extends JovoRequest {
  $type = 'facebook';
  id?: string;
  time?: number;
  /**
   * Will always be a single-item-array if defined.
   * @link https://developers.facebook.com/docs/messenger-platform/reference/webhook-events#entry
   */
  messaging?: [MessagingData];

  getLocale(): string | undefined {
    return;
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }

  getIntent(): JovoInput['intent'] {
    return;
  }

  setIntent(intent: string): void {
    this.nlu = { intentName: intent };
  }

  getEntities(): EntityMap | undefined {
    return;
  }

  getInputType(): InputTypeLike | undefined {
    const postbackPayload = this.messaging?.[0]?.postback?.payload;
    if (postbackPayload === FACEBOOK_LAUNCH_PAYLOAD) {
      return InputType.Launch;
    }
    return InputType.Text;
  }

  getInputText(): JovoInput['text'] {
    return this.messaging?.[0]?.message?.text || this.messaging?.[0]?.postback?.title;
  }

  getInputAudio(): JovoInput['audio'] {
    return;
  }

  getSessionData(): UnknownObject | undefined {
    return undefined;
  }

  setSessionData(): void {
    return;
  }

  getSessionId(): string | undefined {
    return undefined;
  }

  isNewSession(): boolean | undefined {
    return undefined;
  }

  getDeviceCapabilities(): FacebookMessengerCapabilityType[] | undefined {
    return;
  }

  getUserId(): string | undefined {
    return undefined;
  }

  setUserId(): void {
    return;
  }
}
