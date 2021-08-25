import { InputTypeLike, JovoInput, JovoRequest, OmitWhere, UnknownObject } from '@jovotech/framework';
import { CoreCapabilityType } from './CoreDevice';
import { Context } from './interfaces';

export class CoreRequest extends JovoRequest {
  version?: string;
  platform?: 'core' | string;
  id?: string; // UUID v4
  timestamp?: string; // Always in local time, ISO 8601 YYYY-MM-DDTHH:mm:ss.sssZ
  timeZone?: string; // IANA time zone names e.g. Europe/Berlin
  locale?: string; // e.g. de-DE, en-US
  data?: UnknownObject; // this.$request
  // eslint-disable-next-line @typescript-eslint/ban-types
  input?: OmitWhere<JovoInput, Function>;
  context?: Context;

  getLocale(): string | undefined {
    return this.locale;
  }

  getIntent(): JovoInput['intent'] {
    return this.input?.intent;
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
    return this.context?.session?.data;
  }
  getSessionId(): string | undefined {
    return this.context?.session?.id;
  }
  isNewSession(): boolean | undefined {
    return this.context?.session?.new;
  }

  getDeviceCapabilities(): CoreCapabilityType[] | undefined {
    return this.context?.device?.capabilities;
  }
}
