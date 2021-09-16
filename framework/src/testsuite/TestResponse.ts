import { JovoResponse } from '..';

export class TestResponse extends JovoResponse {
  isTestResponse!: boolean;
  shouldEndSession?: boolean;

  hasSessionEnded(): boolean {
    return !!this.shouldEndSession;
  }
}
