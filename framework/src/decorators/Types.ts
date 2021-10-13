import { InputTypeLike } from '../JovoInput';
import {
  createHandlerOptionDecorator,
  getValuesOfDecoratorRestParameter,
} from '../metadata/HandlerOptionMetadata';

export function Types(types: InputTypeLike[]): MethodDecorator;
export function Types(...types: InputTypeLike[]): MethodDecorator;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Types(...types: any[]): MethodDecorator {
  return createHandlerOptionDecorator({
    types: getValuesOfDecoratorRestParameter(types),
  });
}
