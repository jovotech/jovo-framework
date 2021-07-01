import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const PrioritizeOverUnhandled = (prioritizeOverUnhandled = true) =>
  createHandlerOptionDecorator({ prioritizeOverUnhandled });
