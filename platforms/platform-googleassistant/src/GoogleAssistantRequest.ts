import { EntityMap, JovoRequest, JovoRequestType } from '@jovotech/framework';
import type { Device, Home, Scene, Session, User } from '@jovotech/output-googleassistant';
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
    // TODO: implement
    return undefined;
  }

  getSessionData(): Record<string, unknown> | undefined {
    return this.session?.params;
  }

  getSessionId(): string | undefined {
    return this.session?.id;
  }

  isNewSession(): boolean | undefined {
    return !this.getSessionData();
  }
}
