import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const SubState: (subState?: string) => MethodDecorator = (subState?: string) =>
  createHandlerOptionDecorator({ subState });
