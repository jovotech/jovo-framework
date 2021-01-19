import { GenericOutput, OutputConverterStrategy } from 'jovo-output';
import {
  App,
  Extensible,
  HandleRequest,
  Jovo,
  JovoRequest,
  JovoResponse,
  MiddlewareCollection,
  Platform,
} from '../../src';

export class ExamplePlatformResponse extends JovoResponse {
  [key: string]: unknown;
}

export class ExamplePlatformApp extends Jovo<JovoRequest, ExamplePlatformResponse> {}

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

export class ExamplePlatform extends Platform<JovoRequest, ExamplePlatformResponse> {
  outputConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig() {
    return {};
  }

  isPlatformRequest(request: Record<string, any>): boolean {
    return true;
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }

  createJovoInstance(app: App, handleRequest: HandleRequest): ExamplePlatformApp {
    return new ExamplePlatformApp(this);
  }
}

export class EmptyPlatform extends Platform<JovoRequest, ExamplePlatformResponse> {
  middlewareCollection = new MiddlewareCollection();

  outputConverterStrategy = new ExamplePlatformOutputConverterStrategy();

  getDefaultConfig() {
    return {};
  }

  isPlatformRequest(request: Record<string, any>): boolean {
    return true;
  }

  mount(parent: Extensible): Promise<void> | void {
    return;
  }

  createJovoInstance(app: App, handleRequest: HandleRequest): ExamplePlatformApp {
    return new ExamplePlatformApp(this);
  }
}
