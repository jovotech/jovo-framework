import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export const Platforms = (platforms: string[]) => createHandlerOptionDecorator({ platforms });
