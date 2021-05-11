import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const Global = (isGlobal = true) => createHandlerOptionDecorator({ global: isGlobal });
