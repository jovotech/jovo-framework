import { Alexa } from './Alexa';

import { PlayerActivity, Request } from './interfaces';

export class AlexaAudioPlayer {
  constructor(private alexa: Alexa) {}

  get offsetInMilliseconds(): number | undefined {
    return this.alexa.$request.context?.AudioPlayer?.offsetInMilliseconds;
  }

  get playerActivity(): PlayerActivity | undefined {
    return this.alexa.$request.context?.AudioPlayer?.playerActivity;
  }

  get token(): string | undefined {
    return this.alexa.$request.context?.AudioPlayer?.token;
  }

  get error(): Request['error'] {
    return this.alexa.$request.request?.error;
  }

  toJSON(): AlexaAudioPlayer {
    return { ...this, alexa: undefined };
  }
}
