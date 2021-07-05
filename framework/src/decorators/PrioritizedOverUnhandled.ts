import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const PrioritizedOverUnhandled: (prioritizedOverUnhandled?: boolean) => MethodDecorator = (
  prioritizedOverUnhandled = true,
) => createHandlerOptionDecorator({ prioritizedOverUnhandled });
