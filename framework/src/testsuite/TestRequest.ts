import { UnknownObject } from '@jovotech/framework';
import { JovoRequest, JovoSession, EntityMap } from '..';
import { Intent } from '../interfaces';
import { AudioInput, InputType, InputTypeLike } from '../JovoInput';

export class TestRequest extends JovoRequest {
  isTestRequest = true;
  intent!: string;
  locale!: string;
  session: JovoSession = new JovoSession({ state: [] });
  userId!: string;

  getLocale(): string | undefined {
    return this.locale;
  }

  setLocale(locale: string): void {
    this.locale = locale;
  }

  getIntent(): string | Intent | undefined {
    return this.intent;
  }

  setIntent(intent: string): void {
    this.intent = intent;
  }

  getEntities(): EntityMap | undefined {
    return;
  }

  getInputType(): InputTypeLike | undefined {
    return this.session.isNew ? InputType.Launch : InputType.Intent;
  }

  getInputText(): string | undefined {
    return;
  }

  getInputAudio(): AudioInput | undefined {
    return;
  }

  setSessionData(data: UnknownObject): void {
    this.session.data = data;
  }

  getUserId(): string | undefined {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getSessionData(): UnknownObject | undefined {
    return this.session.data;
  }

  getSessionId(): string | undefined {
    return this.session.id;
  }

  isNewSession(): boolean | undefined {
    return this.session.isNew;
  }

  getDeviceCapabilities(): string[] | undefined {
    return;
  }
}
