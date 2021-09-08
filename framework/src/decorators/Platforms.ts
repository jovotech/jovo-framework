import { OmitIndex, OutputTemplatePlatforms } from '../index';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export type RegisteredPlatformName = Exclude<
  keyof OmitIndex<OutputTemplatePlatforms, string>,
  number
>;

export function Platforms(...platforms: Array<RegisteredPlatformName | string>): MethodDecorator;
export function Platforms(platforms: Array<RegisteredPlatformName | string>): MethodDecorator;
export function Platforms(
  platforms: RegisteredPlatformName | string | Array<RegisteredPlatformName | string>,
): MethodDecorator {
  return createHandlerOptionDecorator({
    platforms: typeof platforms === 'string' ? [platforms] : platforms,
  });
}
