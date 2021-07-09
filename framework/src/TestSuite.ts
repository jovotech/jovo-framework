import { existsSync, readFileSync, unlinkSync, writeFile, writeFileSync } from 'fs';
import _merge from 'lodash.merge';
import { join as joinPaths } from 'path';
import {
  JovoResponse,
  OutputTemplate,
  OutputTemplateConverterStrategy,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { App } from './App';
import { JovoRequest } from './JovoRequest';
import { HandleRequest } from './HandleRequest';
import { Headers, QueryParams, Server } from './Server';
import { Platform } from './Platform';
import { Jovo, JovoConstructor, JovoRequestType } from './Jovo';
import { RequestType } from './enums';
import { JovoUser } from './JovoUser';
import { Plugin, PluginConfig } from './Plugin';
import { EntityMap } from './interfaces';
import { JovoSession } from './JovoSession';
import { JovoError } from './JovoError';
import { Constructor } from '.';

export interface Input {
  type: RequestType;
  intent: string | { name: string; confidence: number };
  entities: any;
}

export class TestServer extends Server {
  constructor(private readonly request: JovoRequest) {
    super();
  }

  hasWriteFileAccess(): boolean {
    return true;
  }

  getRequestObject(): Record<string, any> {
    return this.request;
  }

  getQueryParams(): QueryParams {
    return {};
  }

  getRequestHeaders(): Headers {
    return { 'jovo-test': 'TestServer' };
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setResponseHeaders(header: Record<string, string>): void {}
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  async setResponse(response: any): Promise<void> {}

  fail(error: Error): void {
    console.error('TestServer.fail:');
    console.error(error);
  }
}

export class TestRequest extends JovoRequest {
  responseClass = TestResponse;

  isTestRequest = true;
  session!: JovoSession;

  getEntities(): EntityMap | undefined {
    return {};
  }
  getIntentName(): string | undefined {
    return;
  }
  getLocale(): string | undefined {
    return;
  }
  getRawText(): string | undefined {
    return;
  }
  getRequestType(): JovoRequestType | undefined {
    return;
  }
  getSessionId(): string | undefined {
    return;
  }
  getSessionData(): Record<string, unknown> | undefined {
    return this.session;
  }
  isNewSession(): boolean | undefined {
    return this.session.isNew;
  }
}

export class TestResponse extends JovoResponse {
  isTestResponse!: boolean;
}

export class TestJovo extends Jovo<TestRequest, TestResponse> {}

export class TestOutputConverterStrategy implements OutputTemplateConverterStrategy<TestResponse> {
  readonly responseClass = TestResponse;

  toResponse(output: OutputTemplate | OutputTemplate[]): TestResponse | TestResponse[] {
    return { isTestResponse: true };
  }

  fromResponse(response: TestResponse | TestResponse[]): OutputTemplate | OutputTemplate[] {
    return {};
  }
}

export class TestUser extends JovoUser<TestRequest, TestResponse, TestJovo> {
  id = 'TestUser';
}

export class TestPlatform extends Platform<TestRequest, TestResponse, TestJovo, any> {
  readonly jovoClass = TestJovo;
  readonly requestClass = TestRequest;
  readonly outputTemplateConverterStrategy = new TestOutputConverterStrategy();
  readonly userClass = TestUser;

  isRequestRelated(request: TestRequest): boolean {
    return request.isTestRequest;
  }

  finalizeResponse(response: TestResponse | TestResponse[], jovo: TestJovo) {
    return response;
  }

  isResponseRelated(response: TestResponse | TestResponse[]) {
    return true;
  }

  getDefaultConfig() {
    return {};
  }
}

export type PlatformResponse<PLATFORM extends Platform> = PLATFORM extends Platform<
  infer REQUEST,
  infer RESPONSE
>
  ? RESPONSE
  : never;
export type TestSuiteResponse<REQUEST extends JovoRequest = TestRequest> = {
  output: OutputTemplate | OutputTemplate[];
  response: REQUEST['responseClass'] | REQUEST['responseClass'][];
};

export interface TestSuiteConfig extends PluginConfig {
  userId?: string;
  locale?: string;
  defaultDbDirectory?: string;
  deleteDbOnSessionEnded?: boolean;
}

export class TestSuite<PLATFORM extends Platform> extends Plugin {
  private isRequest!: boolean;
  private requestOrInput!: JovoRequest | Input;
  private output!: OutputTemplate | OutputTemplate[];
  private response!: PlatformResponse<PLATFORM>;

  $session: JovoSession = new JovoSession();
  $user: TestUser = new TestUser();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(readonly config: TestSuiteConfig<PLATFORM> = { platform: new TestPlatform() }) {
    super();
  }

  getDefaultConfig(): TestSuiteConfig {
    return {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      platform: new TestPlatform(),
      userId: this.generateRandomUserId(),
    };
  }

  async run(input: Input): Promise<TestSuiteResponse>;
  async run<REQUEST extends JovoRequest>(request: REQUEST): Promise<TestSuiteResponse<REQUEST>>;
  async run(requestOrInput: JovoRequest | Input): Promise<TestSuiteResponse> {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const app: App = require(joinPaths(process.cwd(), 'src', 'app')).app;
    this.requestOrInput = requestOrInput;

    let request: JovoRequest;
    if (requestOrInput instanceof JovoRequest) {
      this.isRequest = true;
      request = requestOrInput;
    } else {
      this.isRequest = false;
      request = this.config.platform.createRequestInstance({ session: this.$session });
      this.config.platform.isRequestRelated = () => true;
    }
    const server: TestServer = new TestServer(request);

    app.use(this.config.platform, this);
    await app.initialize();
    await app.handle(server);

    return { response: this.response, output: this.output };
  }

  install(app: App): void {
    if (!this.isRequest) {
      app.middlewareCollection.remove('request', 'interpretation.asr', 'interpretation.nlu');
      app.middlewareCollection.use('before.dialog.context', this.injectInput.bind(this));
    }
    app.middlewareCollection.use('after.response', this.returnResponse.bind(this));
  }

  injectInput(handleRequest: HandleRequest, jovo: Jovo): void {
    jovo.$type = { type: this.requestOrInput.type as RequestType };
    jovo.$nlu.intent = {
      name: (this.requestOrInput.intent as string) || (this.requestOrInput.type as RequestType),
    };
  }

  returnResponse(handleRequest: HandleRequest, jovo: Jovo): void {
    this.output = jovo.$output;
    this.response = jovo.$response! as PlatformResponse<PLATFORM>;
    jovo.$session.isNew = false;
    this.$session = jovo.$session;
  }

  private generateRandomUserId() {
    return Math.random().toString(36).substring(7);
  }
}
