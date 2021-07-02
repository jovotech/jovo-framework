import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const PrioritizeOverUnhandled: (prioritizeOverUnhandled?: boolean) => MethodDecorator = (
  prioritizeOverUnhandled = true,
) => createHandlerOptionDecorator({ prioritizeOverUnhandled });
