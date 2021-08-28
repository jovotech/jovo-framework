import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export function Platforms(...platforms: string[]): MethodDecorator;
export function Platforms(platforms: string[]): MethodDecorator;
export function Platforms(platforms: string | string[]): MethodDecorator {
  return createHandlerOptionDecorator({
    platforms: typeof platforms === 'string' ? [platforms] : platforms,
  });
}
