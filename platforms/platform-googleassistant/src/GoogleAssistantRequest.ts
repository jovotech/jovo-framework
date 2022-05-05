import {
  Capability,
  EntityMap,
  InputType,
  InputTypeLike,
  JovoInput,
  JovoRequest,
  UnknownObject,
} from '@jovotech/framework';
import { GoogleAssistantSystemInputType, GoogleAssistantSystemIntent } from './enums';
import { GoogleAssistantCapability, GoogleAssistantCapabilityType } from './GoogleAssistantDevice';
import { Context, GoogleAssistantEntity, Handler, Intent } from './interfaces';
import type { Device, Home, Scene, Session, User } from './output';
import { Capability as NativeCapability } from './output';

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

  setLocale(locale: string): void {
    if (!this.user) {
      return;
    }

    this.user.locale = locale;
  }

  getIntent(): JovoInput['intent'] {
    return this.intent?.name;
  }

  setIntent(intent: string): void {
    if (!this.intent) {
      this.intent = { name: intent, params: {} };
    }

    this.intent.name = intent;
  }

  getEntities(): EntityMap<GoogleAssistantEntity> | undefined {
    const entities: EntityMap<GoogleAssistantEntity> = {};
    for (const param in this.intent?.params) {
      if (this.intent?.params.hasOwnProperty(param)) {
        entities[param] = {
          native: this.intent.params[param],
          id: this.intent.params[param].resolved as string,
          value: this.intent.params[param].original,
          resolved: this.intent.params[param].resolved as string,
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

  setSessionData(data: UnknownObject): void {
    if (!this.session) {
      return;
    }

    this.session.params = data;
  }

  getSessionId(): string | undefined {
    return this.session?.id;
  }
  isNewSession(): boolean | undefined {
    const sessionData = this.getSessionData();
    return !sessionData || Object.keys(sessionData).length === 0;
  }

  getDeviceCapabilities(): GoogleAssistantCapabilityType[] | undefined {
    const supportedCapabilities = this.device?.capabilities as GoogleAssistantCapabilityType[];
    if (!supportedCapabilities) {
      return;
    }
    const capabilities: GoogleAssistantCapabilityType[] = [];
    if (supportedCapabilities?.includes(NativeCapability.Speech)) {
      capabilities.push(Capability.Audio);
    }
    if (supportedCapabilities?.includes(NativeCapability.LongFormAudio)) {
      capabilities.push(Capability.LongformAudio);
    }
    if (supportedCapabilities?.includes(NativeCapability.RichResponse)) {
      capabilities.push(Capability.Screen);
    }
    if (supportedCapabilities?.includes(NativeCapability.WebLink)) {
      capabilities.push(GoogleAssistantCapability.WebLink);
    }
    if (supportedCapabilities?.includes(NativeCapability.InteractiveCanvas)) {
      capabilities.push(GoogleAssistantCapability.InteractiveCanvas);
    }
    return capabilities;
  }

  getUserId(): string | undefined {
    return this.user?.params?.userId as string;
  }

  setUserId(userId: string): void {
    if (!this.user?.params) {
      return;
    }

    this.user.params.userId = userId;
  }
}
