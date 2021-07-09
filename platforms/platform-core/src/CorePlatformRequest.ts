import { EntityMap, JovoRequest, JovoRequestType, JovoSession } from '@jovotech/framework';
import { CorePlatformResponse } from '@jovotech/output-core';
import { Context, Request, RequestBodyText } from './interfaces';

export class CorePlatformRequest extends JovoRequest {
  responseClass = CorePlatformResponse;

  version?: string;
  type?: 'jovo-platform-core' | string;
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

  setLocale(locale: string | undefined): void {
    if (!this.request) {
      // TODO: What to do here?
      return;
    }
    this.request.locale = locale;
  }

  getRawText(): string | undefined {
    return (this.request?.body as RequestBodyText | undefined)?.text;
  }

  getRequestType(): JovoRequestType | undefined {
    return this.request?.type ? { type: this.request.type } : undefined;
  }

  getSessionData(): Record<string, unknown> | undefined {
    return this.context?.session?.data;
  }

  setSessionData(data: Record<string, unknown>): void {
    if (!this.context) {
      // TODO: What to do here?
      return;
    }
    this.context.session.data = new JovoSession(data);
  }

  getSessionId(): string | undefined {
    return this.context?.session?.id;
  }

  isNewSession(): boolean | undefined {
    return this.context?.session?.new;
  }

  getUserId(): string {
    // TODO: Maybe return string | undefined?
    return this.context!.user.id;
  }

  setUserId(userId: string): void {
    if (!this.context) {
      // TODO: What to do here?
      return;
    }

    this.context.user.id = userId;
  }
}
