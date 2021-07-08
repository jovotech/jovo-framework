import {EntityMap, JovoRequest, JovoRequestType, RequestType, UnknownObject} from '@jovotech/framework';
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

  getEntities(): EntityMap | undefined {
    return this.inputs;
  }

  getIntentName(): string | undefined {
    return this.nlu?.intentName;
  }

  getLocale(): string | undefined {
    return this.locale;
  }

  getRawText(): string | undefined {
    return this.messaging?.[0]?.message?.text || this.messaging?.[0]?.postback?.title;
  }

  getRequestType(): JovoRequestType | undefined {
    const postbackPayload = this.messaging?.[0]?.postback?.payload;
    // TODO determine whether it should be possible to configure launch-payload
    return {
      type: postbackPayload === FACEBOOK_LAUNCH_PAYLOAD ? RequestType.Launch : RequestType.Intent,
    };
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
