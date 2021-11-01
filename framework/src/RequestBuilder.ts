import { UnknownObject } from '@jovotech/common';
import { Platform } from './Platform';

export type RequestBuilderRequest<PLATFORM extends Platform> = PLATFORM extends Platform<
  infer REQUEST
>
  ? REQUEST
  : never;

export abstract class RequestBuilder<PLATFORM extends Platform> {
  abstract launch(json?: UnknownObject): RequestBuilderRequest<PLATFORM>;

  abstract intent(name?: string): RequestBuilderRequest<PLATFORM>;
  abstract intent(json?: UnknownObject): RequestBuilderRequest<PLATFORM>;
}
