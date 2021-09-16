import { JovoRequest, JovoSession, EntityMap, UnknownObject } from '..';
import { Intent } from '../interfaces';
import { AudioInput, InputType, InputTypeLike } from '../JovoInput';

export class TestRequest extends JovoRequest {
  isTestRequest = true;
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
    return;
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

  setSessionData(data: Record<string, unknown>): void {
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
