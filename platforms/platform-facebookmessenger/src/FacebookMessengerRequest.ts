import {
  EntityMap,
  InputType,
  InputTypeLike,
  JovoInput,
  JovoRequest,
  UnknownObject,
} from '@jovotech/framework';
import { FACEBOOK_LAUNCH_PAYLOAD } from '.';
import { MessagingData } from './interfaces';

export class FacebookMessengerRequest extends JovoRequest {
  id?: string;
  time?: number;
  /**
   * Will always be a single-item-array if defined.
   * @link https://developers.facebook.com/docs/messenger-platform/reference/webhook-events#entry
   */
  messaging?: [MessagingData];
  nlu?: {
    intentName: string;
  };
  inputs?: EntityMap;
  locale?: string;

  getLocale(): string | undefined {
    return this.locale;
  }

  getIntent(): JovoInput['intent'] {
    return this.nlu?.intentName;
  }

  getEntities(): EntityMap | undefined {
    return this.inputs;
  }

  getInputType(): InputTypeLike | undefined {
    const postbackPayload = this.messaging?.[0]?.postback?.payload;
    return postbackPayload === FACEBOOK_LAUNCH_PAYLOAD ? InputType.Launch : InputType.Intent;
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

  getSessionId(): string | undefined {
    return undefined;
  }

  isNewSession(): boolean | undefined {
    return undefined;
  }
}
