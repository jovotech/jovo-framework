import { RequestTypeLike } from '../enums';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const Types: (...types: RequestTypeLike[]) => MethodDecorator = (
  ...types: RequestTypeLike[]
) => createHandlerOptionDecorator({ types });
