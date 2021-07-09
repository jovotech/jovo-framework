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
  userId!: string;
  locale!: string;

  getEntities(): EntityMap | undefined {
    return {};
  }

  getIntentName(): string | undefined {
    return;
  }

  getLocale(): string | undefined {
    return this.locale;
  }

  setLocale(locale: string | undefined): void {
    if (locale) {
      this.locale = locale;
    }
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

  setSessionData(data: Record<string, unknown>): void {
    this.session = new JovoSession(data);
  }

  isNewSession(): boolean | undefined {
    return this.session.isNew;
  }

  getUserId(): string {
    return this.userId;
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }
}

export class TestResponse extends JovoResponse {
  isTestResponse!: boolean;
  shouldEndSession?: boolean;

  hasSessionEnded(): boolean {
    return !!this.shouldEndSession;
  }
}

export class TestJovo extends Jovo<TestRequest, TestResponse> {}

export class TestOutputConverterStrategy extends SingleResponseOutputTemplateConverterStrategy<TestResponse> {
  readonly responseClass = TestResponse;

  platformName = 'testPlatform';

  buildResponse(output: OutputTemplate): TestResponse {
    // TODO: new TestResponse()?
    return {
      isTestResponse: true,
      shouldEndSession: !output.listen,
      hasSessionEnded() {
        return !!this.shouldEndSession;
      },
    };
  }

  fromResponse(response: TestResponse): OutputTemplate {
    return {};
  }
}

export class TestUser extends JovoUser {
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

export type PlatformResponse<REQUEST_OR_INPUT extends JovoRequest | Input = TestRequest> =
  REQUEST_OR_INPUT extends JovoRequest
    ?
        | InstanceType<REQUEST_OR_INPUT['responseClass']>
        | InstanceType<REQUEST_OR_INPUT['responseClass']>[]
    : InstanceType<TestRequest['responseClass']> | InstanceType<TestRequest['responseClass']>[];

export type TestSuiteResponse<REQUEST extends JovoRequest | Input = TestRequest> = {
  output: OutputTemplate | OutputTemplate[];
  response: PlatformResponse<REQUEST>;
};

export interface TestSuiteConfig extends PluginConfig {
  platform: Constructor<Platform>;
  userId: string;
  dbDirectory: string;
  stage?: string;
  locale?: string;
  deleteDbOnSessionEnded?: boolean;
}

export class TestSuite extends Plugin {
  private isRequest!: boolean;
  private requestOrInput!: JovoRequest | Input;
  private output!: OutputTemplate | OutputTemplate[];
  private response!: PlatformResponse;
  private app: App;

  readonly config: TestSuiteConfig;

  $session: JovoSession = new JovoSession();
  $user: TestUser = new TestUser();

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor(config?: Partial<TestSuiteConfig>) {
    super();
    this.config = _merge(this.getDefaultConfig(), config);
    this.app = this.loadApp();
  }

  getDefaultConfig(): TestSuiteConfig {
    return {
      dbDirectory: './db/tests/',
      userId: this.generateRandomUserId(),
      platform: TestPlatform,
    };
  }

  async run<REQUEST extends JovoRequest>(request: REQUEST): Promise<TestSuiteResponse<REQUEST>>;
  async run<INPUT extends Input>(input: INPUT): Promise<TestSuiteResponse<INPUT>>;
  async run<REQUEST_OR_INPUT extends JovoRequest | Input>(
    requestOrInput: REQUEST_OR_INPUT,
  ): Promise<TestSuiteResponse<REQUEST_OR_INPUT>> {
    this.requestOrInput = requestOrInput;
    this.saveUserData();

    this.app.use(this);

    if (!this.isRequest) {
      this.app.use(new TestPlatform());
    }

    await this.app.initialize();

    const request: JovoRequest = this.prepareRequest();
    await this.app.handle(new TestServer(request));

    return { response: this.response as PlatformResponse<REQUEST_OR_INPUT>, output: this.output };
  }

  install(app: App): void {
    if (!this.isRequest) {
      app.middlewareCollection.remove('request', 'interpretation.asr', 'interpretation.nlu');
      app.middlewareCollection.use('before.dialog.context', this.injectInput.bind(this));
    }
    app.middlewareCollection.use('after.response', this.postProcess.bind(this));
  }

  private injectInput(handleRequest: HandleRequest, jovo: Jovo): void {
    jovo.$type = { type: this.requestOrInput.type as RequestType };
    jovo.$nlu.intent = {
      name: (this.requestOrInput.intent as string) || (this.requestOrInput.type as RequestType),
    };
  }

  private postProcess(handleRequest: HandleRequest, jovo: Jovo): void {
    this.output = jovo.$output;
    this.response = jovo.$response! as PlatformResponse;

    // Set session data
    jovo.$session.isNew = false;
    this.$session = jovo.$session;

    // Set user data
    if (this.config.deleteDbOnSessionEnded) {
      const responses: JovoResponse[] = Array.isArray(this.response)
        ? this.response
        : [this.response];

      for (const response of responses) {
        if (response.hasSessionEnded()) {
          this.clearDb();
          break;
        }
      }
    } else {
      this.$user = jovo.$user;
    }
  }

  private loadApp(): App {
    const appDirectory: string[] = [process.cwd(), 'src'];
    const { stage } = this.config;
    const appFileNames: string[] = [`app.${stage}.ts`, `app.${stage}.js`, 'app.ts', 'app.js'];

    for (const appFileName of appFileNames) {
      const appFilePath: string = joinPaths(...appDirectory, appFileName);
      if (existsSync(appFilePath)) {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const { app } = require(appFilePath);
        if (!app) {
          continue;
        }
        return app as App;
      }
    }

    throw new JovoError({ message: 'App not found.' });
  }

  private prepareRequest(): JovoRequest {
    let request: JovoRequest;

    if (this.requestOrInput instanceof JovoRequest) {
      this.isRequest = true;
      request = this.requestOrInput;
    } else {
      this.isRequest = false;
      const platform: Platform = new this.config.platform();
      request = platform.createRequestInstance({});
      // this.config.platform.isRequestRelated = () => true;
    }

    // Reset session data if a new session is incoming
    if (request.isNewSession()) {
      this.$session = new JovoSession({});
    }

    request.setSessionData(this.$session);
    request.setUserId(this.config.userId);
    request.setLocale(this.config.locale);

    return request;
  }

  private saveUserData(): void {
    if (Object.keys(this.$user.$data).length === 0) {
      return;
    }

    const dbPath: string = this.getDbPath();
    if (existsSync(dbPath)) {
      const existingUserData = JSON.parse(readFileSync(dbPath, 'utf-8'));
      const joinedUserData = _merge(existingUserData, this.$user.toJSON());
      writeFileSync(dbPath, JSON.stringify(joinedUserData, null, 2));
    } else {
      writeFileSync(dbPath, JSON.stringify(this.$user.toJSON(), null, 2));
    }
  }

  private clearDb(): void {
    const dbPath: string = this.getDbPath();

    if (!existsSync(dbPath)) {
      // TODO: Throw error?
      return;
    }

    unlinkSync(dbPath);
  }

  private getDbPath(): string {
    return joinPaths(this.config.dbDirectory, `${this.config.userId}.json`);
  }

  private generateRandomUserId() {
    return Math.random().toString(36).substring(7);
  }
}
