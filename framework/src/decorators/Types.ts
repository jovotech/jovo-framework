import { InputTypeLike } from '../JovoInput';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export function Types(...types: InputTypeLike[]): MethodDecorator;
export function Types(types: InputTypeLike[]): MethodDecorator;
export function Types(types: InputTypeLike | InputTypeLike[]): MethodDecorator {
  return createHandlerOptionDecorator({
    types: typeof types === 'string' ? [types] : types,
  });
}
