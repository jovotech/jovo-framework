import {
  CapabilityType,
  DEFAULT_INPUT_TYPE,
  InputTypeLike,
  JovoInput,
  UnknownObject,
} from './index';
import { JovoInputBuilder } from './JovoInputBuilder';
import { JovoSession } from './JovoSession';

export abstract class JovoRequest {
  [key: string]: unknown;

  abstract getLocale(): string | undefined;

  abstract setLocale(locale: string): void;

  abstract getIntent(): JovoInput['intent'];
  abstract getEntities(): JovoInput['entities'];

  abstract getInputType(): InputTypeLike | undefined;
  abstract getInputText(): JovoInput['text'];
  abstract getInputAudio(): JovoInput['audio'];

  getInput(): JovoInput {
    return new JovoInputBuilder(this.getInputType() || DEFAULT_INPUT_TYPE)
      .set('intent', this.getIntent())
      .set('entities', this.getEntities())
      .set('text', this.getInputText())
      .set('audio', this.getInputAudio())
      .build();
  }

  abstract setSessionData(data: Record<string, unknown>): void;

  abstract getUserId(): string | undefined;

  abstract setUserId(userId: string): void;

  abstract getSessionData(): UnknownObject | undefined;
  abstract getSessionId(): string | undefined;
  abstract isNewSession(): boolean | undefined;

  getSession(): Partial<JovoSession> | undefined {
    const sessionId = this.getSessionId();
    const sessionData = this.getSessionData();
    const isNewSession = this.isNewSession();
    return !sessionId && !sessionData && typeof isNewSession === 'undefined'
      ? undefined
      : {
          // TODO determine whether data should be emptied when session is new
          ...(isNewSession ? {} : sessionData || {}),
          id: sessionId,
          isNew: isNewSession,
        };
  }

  abstract getDeviceCapabilities(): CapabilityType[] | undefined;
}
