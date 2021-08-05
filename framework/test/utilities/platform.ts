import { OutputTemplate, OutputTemplateConverterStrategy } from '@jovotech/output';
import {
  AnyObject,
  EntityMap,
  ExtensibleConfig,
  Jovo,
  JovoRequest,
  JovoRequestType,
  JovoResponse,
  JovoUser,
  MiddlewareCollection,
  Platform,
  JovoDevice,
  UnknownObject,
} from '../../src';

export class ExamplePlatformRequest extends JovoRequest {
  getEntities(): EntityMap | undefined {
    return undefined;
  }

  getIntentName(): string | undefined {
    return undefined;
  }

  getLocale(): string | undefined {
    return undefined;
  }

  getRawText(): string | undefined {
    return undefined;
  }

  getRequestType(): JovoRequestType | undefined {
    return undefined;
  }

  getSessionData(): UnknownObject | undefined {
    return undefined;
  }

  getSessionId(): string | undefined {
    return undefined;
  }

  isNewSession(): boolean | undefined {
    return undefined;
  }
}

export class ExamplePlatformResponse extends JovoResponse {}

export class ExamplePlatformJovo extends Jovo<
  ExamplePlatformRequest,
  ExamplePlatformResponse,
  ExamplePlatformJovo,
  ExamplePlatformUser,
  ExamplePlatformDevice,
  ExamplePlatform
> {}

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

export class ExamplePlatformUser extends JovoUser<ExamplePlatformJovo> {
  get id(): string {
    return 'ExamplePlatformUser';
  }
}

export class ExamplePlatformDevice extends JovoDevice<ExamplePlatformJovo> {
  protected setCapabilitiesFromRequest(): void {
    //
  }
}

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
