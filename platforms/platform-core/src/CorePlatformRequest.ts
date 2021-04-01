import { EntityMap, JovoRequest, JovoRequestType, SessionData } from '@jovotech/core';
import { Context, Request } from './interfaces';

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

  getRequestType(): JovoRequestType | undefined {
    return this.request?.type ? { type: this.request.type } : undefined;
  }

  getSessionData(): SessionData | undefined {
    return this.context?.session?.data;
  }
}
