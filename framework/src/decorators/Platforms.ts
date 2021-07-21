import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const Platforms: (platforms: string[]) => MethodDecorator = (platforms: string[]) =>
  createHandlerOptionDecorator({ platforms });
