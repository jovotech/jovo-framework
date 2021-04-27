import { JovoError } from '../JovoError';

export class MatchingPlatformNotFoundError extends JovoError {
  constructor(request: Record<string, unknown>) {
    super({
      message: 'No registered platform can handle the request.',
      context: {
        request,
      },
    });
  }
}
