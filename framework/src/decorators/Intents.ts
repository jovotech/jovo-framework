import { Intent } from '../interfaces';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const Intents = (intents: Array<string | Intent>) =>
  createHandlerOptionDecorator({ intents });
