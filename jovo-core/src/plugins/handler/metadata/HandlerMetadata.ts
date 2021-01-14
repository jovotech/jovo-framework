import { HandleOptions } from '../decorators/Handle';

export class HandlerMetadata {
  constructor(
    // eslint-disable-next-line @typescript-eslint/ban-types
    readonly target: Function,
    readonly propertyKey: string | number | symbol,
    readonly descriptor: PropertyDescriptor,
    readonly options?: HandleOptions,
  ) {}
}
