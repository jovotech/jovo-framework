import { OutputTemplate, OutputTemplateConverterStrategy } from '@jovotech/output';
import {
  EntityMap,
  Extensible,
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

  fromResponse(response: ExamplePlatformResponse): OutputTemplate {
    return {};
  }

  toResponse(output: OutputTemplate): ExamplePlatformResponse {
    return {};
  }
}

export class ExamplePlatform extends Platform<ExamplePlatformRequest, ExamplePlatformResponse> {
  readonly jovoClass = ExamplePlatformApp;
  readonly requestClass = ExamplePlatformRequest;
  outputTemplateConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig() {
    return {};
  }

  isRequestRelated(request: Record<string, any>): boolean {
    return true;
  }

  setResponseSessionData(response: ExamplePlatformResponse, jovo: Jovo): this {
    return this;
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }
}

export class EmptyPlatform extends Platform<ExamplePlatformRequest, ExamplePlatformResponse> {
  middlewareCollection = new MiddlewareCollection();
  readonly jovoClass = ExamplePlatformApp;
  readonly requestClass = ExamplePlatformRequest;
  outputTemplateConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig() {
    return {};
  }

  isRequestRelated(request: Record<string, any>): boolean {
    return true;
  }

  setResponseSessionData(response: ExamplePlatformResponse, jovo: Jovo): this {
    return this;
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }
}
