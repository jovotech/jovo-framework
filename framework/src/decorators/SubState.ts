import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const SubState = (subState?: string) => createHandlerOptionDecorator({ subState });
