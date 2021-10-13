import { Intent } from '../interfaces';
import {
  createHandlerOptionDecorator,
  getValuesOfDecoratorRestParameter,
} from '../metadata/HandlerOptionMetadata';

export function Intents(intents: Array<string | Intent>): MethodDecorator;
export function Intents(...intents: Array<string | Intent>): MethodDecorator;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Intents(...intents: any[]): MethodDecorator {
  return createHandlerOptionDecorator({
    intents: getValuesOfDecoratorRestParameter(intents),
  });
}
