import { JovoError } from '../JovoError';
import { StateStack } from '../JovoSession';

export class MatchingRouteNotFoundError extends JovoError {
  constructor(intent: string, state: StateStack | undefined, request: Record<string, unknown>) {
    super({
      message: 'No matching route was found for the request.',
      context: {
        intent,
        state,
        request,
      },
    });
  }
}
