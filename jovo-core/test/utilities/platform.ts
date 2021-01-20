import { GenericOutput, OutputConverterStrategy } from 'jovo-output';
import {
  Extensible,
  Jovo,
  JovoRequest,
  JovoRequestType,
  JovoResponse,
  MiddlewareCollection,
  Platform,
} from '../../src';

export class ExamplePlatformResponse extends JovoResponse {}

export class ExamplePlatformRequest extends JovoRequest {
  getRequestType(): JovoRequestType | undefined {
    return undefined;
  }
}

export class ExamplePlatformApp extends Jovo<ExamplePlatformRequest, ExamplePlatformResponse> {}

export class ExamplePlatformOutputConverterStrategy
  implements OutputConverterStrategy<ExamplePlatformResponse> {
  responseClass = ExamplePlatformResponse;

  fromResponse(response: ExamplePlatformResponse): GenericOutput {
    return {};
  }

  toResponse(output: GenericOutput): ExamplePlatformResponse {
    return {};
  }
}

export class ExamplePlatform extends Platform<ExamplePlatformRequest, ExamplePlatformResponse> {
  readonly jovoClass = ExamplePlatformApp;
  readonly requestClass = ExamplePlatformRequest;
  outputConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig() {
    return {};
  }

  isRequestRelated(request: Record<string, any>): boolean {
    return true;
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }
}

export class EmptyPlatform extends Platform<ExamplePlatformRequest, ExamplePlatformResponse> {
  middlewareCollection = new MiddlewareCollection();
  readonly jovoClass = ExamplePlatformApp;
  readonly requestClass = ExamplePlatformRequest;
  outputConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig() {
    return {};
  }

  isRequestRelated(request: Record<string, any>): boolean {
    return true;
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }
}
