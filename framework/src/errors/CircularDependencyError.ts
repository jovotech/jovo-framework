import { InjectionToken } from '../metadata/InjectableMetadata';
import { Constructor, JovoError } from '@jovotech/common';

export class CircularDependencyError extends JovoError {
  constructor(readonly dependencyPath: InjectionToken[]) {
    super({
      message: `Circular dependency detected: ${dependencyPath
        .map((x) => String((x as Constructor).name ?? x))
        .join(' -> ')}.`,
    });
  }
}
