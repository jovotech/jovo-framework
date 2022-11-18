import { JovoError, Constructor } from '@jovotech/common';
import { InjectionToken } from '..';

export class UnresolvableDependencyError extends JovoError {
  constructor(
    readonly instantiatedType: Constructor,
    readonly token: InjectionToken | undefined,
    readonly argumentIndex: number,
  ) {
    super(
      `Cannot resolve dependency of the argument of ${instantiatedType.name} with token ${String(
        (token as Constructor).name ?? token,
      )} at index ${argumentIndex}. Please ensure that a provider for this token is registered in the app.`,
    );
  }
}
