import { OmitIndex } from '@jovotech/common';
import { getValuesOfDecoratorRestParameter, OutputTemplatePlatforms } from '../index';
import { createHandlerOptionDecorator } from '../metadata/HandlerOptionMetadata';

export type RegisteredPlatformName = Exclude<
  keyof OmitIndex<OutputTemplatePlatforms, string>,
  number
>;

export function Platforms(platforms: Array<string | RegisteredPlatformName>): MethodDecorator;
export function Platforms(...platforms: Array<string | RegisteredPlatformName>): MethodDecorator;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function Platforms(...platforms: any[]): MethodDecorator {
  return createHandlerOptionDecorator({
    platforms: getValuesOfDecoratorRestParameter(platforms),
  });
}
