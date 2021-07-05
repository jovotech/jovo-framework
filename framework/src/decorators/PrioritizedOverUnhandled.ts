import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const PrioritizedOverUnhandled = (prioritizedOverUnhandled = true) =>
  createHandlerOptionDecorator({ prioritizedOverUnhandled });
