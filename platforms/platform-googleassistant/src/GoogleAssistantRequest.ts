import {
  EntityMap,
  InputType,
  InputTypeLike,
  JovoInput,
  JovoRequest,
  UnknownObject,
} from '@jovotech/framework';
import type { Device, Home, Scene, Session, User } from '@jovotech/output-googleassistant';
import { GoogleAssistantSystemInputType, GoogleAssistantSystemIntent } from './enums';
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

  getLocale(): string | undefined {
    return this.user?.locale;
  }

  getIntent(): JovoInput['intent'] {
    return this.intent?.name;
  }

  getEntities(): EntityMap | undefined {
    const entities: EntityMap = {};

    for (const param in this.intent?.params) {
      if (this.intent?.params.hasOwnProperty(param)) {
        entities[param] = {
          id: this.intent?.params[param].resolved as string,
          value: this.intent?.params[param].original,
          key: this.intent?.params[param].resolved as string,
        };
      }
    }
    return entities;
  }

  getInputType(): InputTypeLike | undefined {
    if (
      this.intent?.name === GoogleAssistantSystemIntent.Main &&
      !Object.keys(this.session?.params || {}).length
    ) {
      return InputType.Launch;
    }
    if (this.intent?.name === GoogleAssistantSystemIntent.Cancel) {
      return InputType.End;
    }
    if (this.intent?.params.AccountLinkingSlot) {
      return GoogleAssistantSystemInputType.ON_SIGN_IN;
    }
    return undefined;
  }
  getInputText(): JovoInput['text'] {
    return this.intent?.query;
  }
  getInputAudio(): JovoInput['audio'] {
    return;
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
