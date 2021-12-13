import { Input, InputTypeLike, JovoInput, JovoRequest, UnknownObject } from '@jovotech/framework';

import { CoreCapabilityType } from './CoreDevice';
import { CoreRequestContext } from './interfaces';

export class CoreRequest extends JovoRequest {
  version?: string;
  platform?: 'core' | string;
  id?: string; // UUID v4
  timestamp?: string; // Always in local time, ISO 8601 YYYY-MM-DDTHH:mm:ss.sssZ
  timeZone?: string; // IANA time zone names e.g. Europe/Berlin
  locale?: string; // e.g. de-DE, en-US
  data?: UnknownObject; // this.$request
  input?: Input;
  context?: CoreRequestContext;

  getLocale(): string | undefined {
    return this.locale;
  }

  getIntent(): JovoInput['intent'] {
    return this.input?.intent;
  }

  setIntent(intent: string): void {
    if (!this.input) {
      this.input = {};
    }
    this.input.intent = intent;
  }

  getEntities(): JovoInput['entities'] {
    return this.input?.entities;
  }

  getInputType(): InputTypeLike | undefined {
    return this.input?.type;
  }
  getInputText(): JovoInput['text'] {
    return this.input?.text;
  }
  getInputAudio(): JovoInput['audio'] {
    return this.input?.audio;
  }

  getSessionData(): UnknownObject | undefined {
    return this.context?.session;
  }

  getSessionId(): string | undefined {
    return this.context?.session?.id;
  }

  isNewSession(): boolean | undefined {
    return this.context?.session?.isNew;
  }

  getDeviceCapabilities(): CoreCapabilityType[] | undefined {
    return this.context?.device?.capabilities;
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }

  setSessionData(data: Record<string, unknown>): void {
    if (!this.context?.session?.data) {
      return;
    }

    this.context.session.data = data;
  }

  getUserId(): string | undefined {
    return this.context?.user.id;
  }

  setUserId(userId: string): void {
    if (!this.context) {
      // TODO: What to do here? => set this.context in constructor
      return;
    }

    this.context.user.id = userId;
  }
}
