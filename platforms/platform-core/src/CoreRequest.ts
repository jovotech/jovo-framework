import { EntityMap, JovoRequest, JovoRequestType, UnknownObject } from '@jovotech/framework';
import { Context, Input } from './interfaces';

export class CoreRequest extends JovoRequest {
  version?: string;
  platform?: 'core' | string;
  id?: string; // UUID v4
  timestamp?: string; // Always in local time, ISO 8601 YYYY-MM-DDTHH:mm:ss.sssZ
  timeZone?: string; // IANA time zone names e.g. Europe/Berlin
  locale?: string; // e.g. de-DE, en-US
  data?: UnknownObject; // this.$request
  input?: Input;
  context?: Context;

  getEntities(): EntityMap | undefined {
    return this.input?.entities;
  }

  getIntentName(): string | undefined {
    return typeof this.input?.intent === 'string' ? this.input?.intent : this.input?.intent?.name;
  }

  getLocale(): string | undefined {
    return this.locale;
  }

  getRawText(): string | undefined {
    return this.input?.text;
  }

  getRequestType(): JovoRequestType | undefined {
    return this.input?.type;
  }

  getSessionData(): UnknownObject | undefined {
    return this.context?.session?.data;
  }

  getSessionId(): string | undefined {
    return this.context?.session?.id;
  }

  isNewSession(): boolean | undefined {
    return this.context?.session?.new;
  }
}
