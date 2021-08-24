import { Intent } from '../interfaces';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export function Intents(...intents: Array<string | Intent>): MethodDecorator;
export function Intents(intents: Array<string | Intent>): MethodDecorator;
export function Intents(intents: string | Intent | Array<string | Intent>): MethodDecorator {
  return createHandlerOptionDecorator({
    intents: typeof intents === 'string' || !Array.isArray(intents) ? [intents] : intents,
  });
}
