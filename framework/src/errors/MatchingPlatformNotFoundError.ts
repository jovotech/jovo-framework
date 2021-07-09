import { UnknownObject } from '../index';
import { JovoError } from '../JovoError';

export class MatchingPlatformNotFoundError extends JovoError {
  constructor(request: UnknownObject) {
    super({
      message: 'No registered platform can handle the request.',
      context: {
        request,
      },
    });
  }
}
