import { Platform } from './Platform';

export type RequestBuilderRequest<PLATFORM extends Platform> = PLATFORM extends Platform<
  infer REQUEST
>
  ? REQUEST
  : never;

export abstract class RequestBuilder<PLATFORM extends Platform> {
  abstract launch(json?: Record<string, unknown>): RequestBuilderRequest<PLATFORM>;

  abstract intent(name?: string): RequestBuilderRequest<PLATFORM>;
  abstract intent(json?: Record<string, unknown>): RequestBuilderRequest<PLATFORM>;
}
