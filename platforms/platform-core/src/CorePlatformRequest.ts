import { EntityMap, JovoRequest, JovoRequestType, JovoSession } from '@jovotech/framework';
import { Context, Request, RequestBodyText } from './interfaces';

export interface CorePlatformRequestJSON {
  version?: string;
  type?: 'jovo-platform-core' | string;
  request?: Request;
  context?: Context;
}

export class CorePlatformRequest extends JovoRequest implements CorePlatformRequestJSON {
  version?: string;
  type?: CorePlatformRequestJSON['type'];
  request?: Request;
  context?: Context;

  getEntities(): EntityMap | undefined {
    return this.request?.nlu?.inputs;
  }

  getIntentName(): string | undefined {
    return this.request?.nlu?.intent;
  }

  getLocale(): string | undefined {
    return this.request?.locale;
  }

  getRawText(): string | undefined {
    return (this.request?.body as RequestBodyText | undefined)?.text;
  }

  getRequestType(): JovoRequestType | undefined {
    return this.request?.type ? { type: this.request.type } : undefined;
  }

  getSession(): JovoSession | undefined {
    return this.context?.session?.data;
  }
}
