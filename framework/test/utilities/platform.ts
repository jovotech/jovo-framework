import {
  NormalizedOutputTemplate,
  OutputTemplateConverterStrategy,
  OutputTemplateConverterStrategyConfig,
} from '@jovotech/output';
import {
  AnyObject,
  CapabilityType,
  EntityMap, Extensible,
  ExtensibleConfig,
  HandleRequest,
  Input,
  InputTypeLike,
  Jovo,
  JovoDevice,
  JovoInput,
  JovoRequest,
  JovoResponse,
  JovoSession,
  JovoUser,
  MiddlewareCollection,
  Platform,
  RequestBuilder,
  UnknownObject,
} from '../../src';

export class ExamplePlatformRequest extends JovoRequest {
  input: Input = {};
  session?: Partial<JovoSession> = {};

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
    return this.input.intent;
  }

  setIntent(): void {
    return;
  }

  getEntities(): EntityMap | undefined {
    return this.input.entities;
  }

  getInputType(): InputTypeLike | undefined {
    return this.input.type;
  }

  getInputText(): JovoInput['text'] {
    return this.input.text;
  }

  getInputAudio(): JovoInput['audio'] {
    return this.input.audio;
  }

  getSessionData(): UnknownObject | undefined {
    return this.session?.data;
  }

  setSessionData(): void {
    return;
  }

  getSessionId(): string | undefined {
    return this.session?.id;
  }

  isNewSession(): boolean | undefined {
    return this.session?.isNew;
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
  output: NormalizedOutputTemplate[] = [];
  session?: Partial<JovoSession> = {};
  error?: unknown;

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
  fromResponse(response: ExamplePlatformResponse): NormalizedOutputTemplate {
    return {};
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  toResponse(
    output: NormalizedOutputTemplate | NormalizedOutputTemplate[],
  ): ExamplePlatformResponse {
    output = Array.isArray(output) ? output : [output];
    return this.normalizeResponse({
      output,
    }) as ExamplePlatformResponse;
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
  readonly id: string = 'example';
  readonly outputTemplateConverterStrategy = new ExamplePlatformOutputConverterStrategy();
  readonly requestClass = ExamplePlatformRequest;
  readonly jovoClass = ExamplePlatformJovo;
  readonly userClass = ExamplePlatformUser;
  readonly deviceClass = ExamplePlatformDevice;
  readonly requestBuilder = ExamplePlatformRequestBuilder;

  getDefaultConfig(): ExtensibleConfig {
    return {};
  }

  mount(parent: Extensible) {
    super.mount(parent);
    this.middlewareCollection.use('after.request.end', (jovo) => {
      this.enableDatabaseSessionStorage(jovo);
    });
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
    if (Array.isArray(response)) {
      response.forEach((res) => {
        res.session = jovo.$session;
      });
    } else {
      response.session = jovo.$session;
    }
    return response;
  }
}

export class EmptyPlatform extends ExamplePlatform {
  initializeMiddlewareCollection(): MiddlewareCollection {
    return new MiddlewareCollection();
  }
}
