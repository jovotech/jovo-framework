import {
  EntityMap,
  JovoRequest,
  JovoRequestType,
  RequestType,
  UnknownObject,
} from '@jovotech/framework';
import type { Device, Home, Scene, Session, User } from '@jovotech/output-googleassistant';
import { GoogleAssistantSystemIntent, GoogleAssistantSystemRequestType } from './enums';
import { Context, Handler, Intent } from './interfaces';

export class GoogleAssistantRequest extends JovoRequest {
  handler?: Handler;
  intent?: Intent;
  scene?: Scene;
  session?: Session;
  user?: User;
  home?: Home;
  device?: Device;
  context?: Context;

  getEntities(): EntityMap | undefined {
    const entities: EntityMap = {};

    for (const param in this.intent?.params) {
      if (this.intent?.params.hasOwnProperty(param)) {
        entities[param] = {
          id: this.intent?.params[param].resolved as string,
          value: this.intent?.params[param].original,
          key: this.intent?.params[param].resolved as string,
          name: param,
        };
      }
    }
    return entities;
  }

  getIntentName(): string | undefined {
    return this.intent?.name;
  }

  getLocale(): string | undefined {
    return this.user?.locale;
  }

  getRawText(): string | undefined {
    return this.intent?.query;
  }

  getRequestType(): JovoRequestType | undefined {
    if (
      this.intent?.name === GoogleAssistantSystemIntent.Main &&
      !Object.keys(this.session?.params || {}).length
    ) {
      return {
        type: RequestType.Launch,
      };
    }
    if (this.intent?.name === GoogleAssistantSystemIntent.Cancel) {
      return {
        type: RequestType.End,
      };
    }

    if (this.intent?.params.AccountLinkingSlot) {
      return {
        type: GoogleAssistantSystemRequestType.ON_SIGN_IN,
      };
    }

    return undefined;
  }

  getSessionData(): UnknownObject | undefined {
    return this.session?.params;
  }

  getSessionId(): string | undefined {
    return this.session?.id;
  }

  isNewSession(): boolean | undefined {
    return !this.getSessionData();
  }
}
