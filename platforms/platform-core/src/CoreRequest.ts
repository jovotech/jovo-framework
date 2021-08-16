import {
  AsrData,
  EntityMap,
  InputTypeLike,
  JovoInput,
  JovoRequest,
  UnknownObject,
} from '@jovotech/framework';
import { Context, Request, RequestBodyAudio, RequestBodyText } from './interfaces';

export class CoreRequest extends JovoRequest {
  version?: string;
  type?: 'jovo-platform-core' | string;
  request?: Request;
  context?: Context;

  getLocale(): string | undefined {
    return this.request?.locale;
  }

  getIntent(): JovoInput['intent'] {
    return this.request?.nlu?.intent;
  }

  getEntities(): EntityMap | undefined {
    return this.request?.nlu?.inputs;
  }

  getInputType(): InputTypeLike | undefined {
    return this.request?.type;
  }

  getInputText(): JovoInput['text'] {
    return (this.request?.body as RequestBodyText | undefined)?.text;
  }

  getInputAudio(): JovoInput['audio'] {
    const audio = (this.request?.body as RequestBodyAudio | undefined)?.audio;
    if (!audio) {
      return;
    }
    return {
      sampleRate: audio?.sampleRate,
      base64: audio.b64string,
    };
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
