import {
  OutputTemplate,
  OutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
} from '@jovotech/output';
import {
  AnyObject,
  CapabilityType,
  EntityMap,
  ExtensibleConfig,
  InputTypeLike,
  Jovo,
  JovoDevice,
  JovoInput,
  JovoRequest,
  JovoResponse,
  JovoUser,
  MiddlewareCollection,
  Platform,
  RequestBuilder,
  UnknownObject,
} from '../../src';

export class ExamplePlatformRequest extends JovoRequest {
  getUserId(): string | undefined {
    return;
  }

  setUserId(): void {
    return;
  }

  getLocale(): string | undefined {
    return undefined;
  }

  setLocale(): void {
    return;
  }

  getIntent(): JovoInput['intent'] {
    return undefined;
  }

  setIntent(): void {
    return;
  }

  getEntities(): EntityMap | undefined {
    return undefined;
  }

  getInputType(): InputTypeLike | undefined {
    return undefined;
  }

  getInputText(): JovoInput['text'] {
    return undefined;
  }

  getInputAudio(): JovoInput['audio'] {
    return undefined;
  }

  getSessionData(): UnknownObject | undefined {
    return undefined;
  }

  setSessionData(): void {
    return;
  }

  getSessionId(): string | undefined {
    return undefined;
  }

  isNewSession(): boolean | undefined {
    return undefined;
  }

  getDeviceCapabilities(): CapabilityType[] | undefined {
    return;
  }
}

export class ExamplePlatformRequestBuilder extends RequestBuilder<ExamplePlatform> {
  launch(): ExamplePlatformRequest {
    return new ExamplePlatformRequest();
  }

  intent(name?: string): ExamplePlatformRequest;
  intent(json?: UnknownObject): ExamplePlatformRequest;
  intent(): ExamplePlatformRequest {
    return new ExamplePlatformRequest();
  }
}

export class ExamplePlatformResponse extends JovoResponse {
  hasSessionEnded(): boolean {
    return false;
  }
}

export class ExamplePlatformJovo extends Jovo<
  ExamplePlatformRequest,
  ExamplePlatformResponse,
  ExamplePlatformJovo,
  ExamplePlatformUser,
  ExamplePlatformDevice,
  ExamplePlatform
> {}

export class ExamplePlatformOutputConverterStrategy extends OutputTemplateConverterStrategy<
  ExamplePlatformResponse,
  OutputTemplateConverterStrategyConfig
> {
  platformName = 'Example';
  responseClass = ExamplePlatformResponse;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  fromResponse(response: ExamplePlatformResponse): OutputTemplate {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toResponse(output: OutputTemplate): ExamplePlatformResponse {
    return this.prepareResponse({}) as ExamplePlatformResponse;
  }
}

export class ExamplePlatformUser extends JovoUser<ExamplePlatformJovo> {
  get id(): string | undefined {
    return 'ExamplePlatformUser';
  }
}

export class ExamplePlatformDevice extends JovoDevice<ExamplePlatformJovo> {}

export class ExamplePlatform extends Platform<
  ExamplePlatformRequest,
  ExamplePlatformResponse,
  ExamplePlatformJovo,
  ExamplePlatformUser,
  ExamplePlatformDevice,
  ExamplePlatform
> {
  outputTemplateConverterStrategy = new ExamplePlatformOutputConverterStrategy();
  requestClass = ExamplePlatformRequest;
  jovoClass = ExamplePlatformJovo;
  userClass = ExamplePlatformUser;
  deviceClass = ExamplePlatformDevice;
  requestBuilder = ExamplePlatformRequestBuilder;

  getDefaultConfig(): ExtensibleConfig {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isRequestRelated(request: AnyObject | ExamplePlatformRequest): boolean {
    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  isResponseRelated(response: AnyObject | ExamplePlatformResponse): boolean {
    return true;
  }

  finalizeResponse(
    response: ExamplePlatformResponse[] | ExamplePlatformResponse,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    jovo: Jovo<ExamplePlatformRequest, ExamplePlatformResponse>,
  ):
    | ExamplePlatformResponse[]
    | Promise<ExamplePlatformResponse>
    | Promise<ExamplePlatformResponse[]>
    | ExamplePlatformResponse {
    return response;
  }
}

export class EmptyPlatform extends ExamplePlatform {
  initializeMiddlewareCollection(): MiddlewareCollection {
    return new MiddlewareCollection();
  }
}
