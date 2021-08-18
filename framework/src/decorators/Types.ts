import { InputTypeLike } from '../JovoInput';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const Types: (...types: InputTypeLike[]) => MethodDecorator = (...types: InputTypeLike[]) =>
  createHandlerOptionDecorator({ types });
