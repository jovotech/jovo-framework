import { OutputTemplate, OutputTemplateConverterStrategy } from '@jovotech/output';
import { AnyObject, ExtensibleConfig } from '../../dist/types';
import {
  EntityMap,
  Jovo,
  JovoRequest,
  JovoRequestType,
  JovoResponse,
  MiddlewareCollection,
  Platform,
  SessionData,
} from '../../src';

export class ExamplePlatformResponse extends JovoResponse {}

export class ExamplePlatformRequest extends JovoRequest {
  getRequestType(): JovoRequestType | undefined {
    return undefined;
  }

  getEntities(): EntityMap {
    return {};
  }

  getIntentName(): string | undefined {
    return undefined;
  }

  getSessionData(): SessionData | undefined {
    return undefined;
  }
}

export class ExamplePlatformApp extends Jovo<ExamplePlatformRequest, ExamplePlatformResponse> {}

export class ExamplePlatformOutputConverterStrategy
  implements OutputTemplateConverterStrategy<ExamplePlatformResponse>
{
  responseClass = ExamplePlatformResponse;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromResponse(response: ExamplePlatformResponse): OutputTemplate {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toResponse(output: OutputTemplate): ExamplePlatformResponse {
    return {};
  }
}

export class ExamplePlatform extends Platform<ExamplePlatformRequest, ExamplePlatformResponse> {
  readonly jovoClass = ExamplePlatformApp;
  readonly requestClass = ExamplePlatformRequest;
  outputTemplateConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig(): ExtensibleConfig {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isRequestRelated(request: AnyObject): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setResponseSessionData(response: ExamplePlatformResponse, jovo: Jovo): this {
    return this;
  }
}

export class EmptyPlatform extends Platform<ExamplePlatformRequest, ExamplePlatformResponse> {
  middlewareCollection = new MiddlewareCollection();
  readonly jovoClass = ExamplePlatformApp;
  readonly requestClass = ExamplePlatformRequest;
  outputTemplateConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig(): ExtensibleConfig {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isRequestRelated(request: AnyObject): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  setResponseSessionData(response: ExamplePlatformResponse, jovo: Jovo): this {
    return this;
  }
}
