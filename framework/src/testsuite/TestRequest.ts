import { JovoRequest, TestResponse, JovoSession, EntityMap, UnknownObject } from '..';
import { Intent } from '../interfaces';
import { AudioInput } from '../JovoInput';

export class TestRequest extends JovoRequest {
  getLocale(): string | undefined {
    throw new Error('Method not implemented.');
  }
  setLocale(locale: string): void {
    throw new Error('Method not implemented.');
  }
  getIntent(): string | Intent | undefined {
    throw new Error('Method not implemented.');
  }
  getEntities(): EntityMap | undefined {
    throw new Error('Method not implemented.');
  }
  getInputType(): string | undefined {
    throw new Error('Method not implemented.');
  }
  getInputText(): string | undefined {
    throw new Error('Method not implemented.');
  }
  getInputAudio(): AudioInput | undefined {
    throw new Error('Method not implemented.');
  }
  setSessionData(data: Record<string, unknown>): void {
    throw new Error('Method not implemented.');
  }
  getUserId(): string | undefined {
    throw new Error('Method not implemented.');
  }
  setUserId(userId: string): void {
    throw new Error('Method not implemented.');
  }
  getSessionData(): UnknownObject | undefined {
    throw new Error('Method not implemented.');
  }
  getSessionId(): string | undefined {
    throw new Error('Method not implemented.');
  }
  isNewSession(): boolean | undefined {
    throw new Error('Method not implemented.');
  }
  getDeviceCapabilities(): string[] | undefined {
    throw new Error('Method not implemented.');
  }
  responseClass = TestResponse;

  isTestRequest = true;
  session!: JovoSession;
  userId!: string;
  locale!: string;
}
