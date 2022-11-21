import { JovoError, Constructor } from '@jovotech/common';

export class InvalidDependencyError extends JovoError {
  constructor(readonly instantiatedType: Constructor, readonly argumentIndex: number) {
    super(
      `Cannot resolve dependency token of the argument of ${instantiatedType.name} at index ${argumentIndex}. Please ensure that this dependency does not directly or indirectly import the file containing ${instantiatedType.name}.`,
    );
  }
}
