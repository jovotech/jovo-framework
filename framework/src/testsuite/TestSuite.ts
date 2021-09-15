import {
  JovoResponse,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import _cloneDeep from 'lodash.clonedeep';
import _merge from 'lodash.merge';
import { join as joinPaths } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
  App,
  Constructor,
  Jovo,
  JovoError,
  JovoRequest,
  JovoSession,
  OmitWhere,
  Platform,
  Plugin,
  PluginConfig,
  RequestBuilder,
} from '..';
import { HandleRequest } from '../HandleRequest';
import { InputType, JovoInput, JovoInputObject } from '../JovoInput';
import { TestDb } from './TestDb';
import { TestPlatform } from './TestPlatform';
import { TestServer } from './TestServer';

/**
 * Infers generic types of the provided platform
 */
export type PlatformTypes<PLATFORM extends Platform> = PLATFORM extends Platform<
  infer REQUEST,
  infer RESPONSE,
  infer JOVO,
  infer USER,
  infer DEVICE
>
  ? { request: REQUEST; response: RESPONSE; jovo: JOVO; user: USER; device: DEVICE }
  : never;

/**
 * Determines whether the provided response type is of type array or not
 */
export type PlatformResponseType<PLATFORM extends Platform, RESPONSE extends JovoResponse> =
  PLATFORM['outputTemplateConverterStrategy'] extends SingleResponseOutputTemplateConverterStrategy<
    RESPONSE,
    OutputTemplateConverterStrategyConfig
  >
    ? RESPONSE
    : RESPONSE | RESPONSE[];

/**
 * Return type of TestSuite.prototype.run().
 * Returns output, which can be of type array or object, and
 * response, whose type is determined based upon the OutputTemplateConverterStrategy.
 */
export type TestSuiteResponse<PLATFORM extends Platform> = {
  output: OutputTemplate | OutputTemplate[];
  response: PlatformResponseType<PLATFORM, PlatformTypes<PLATFORM>['response']>;
};

export type RequestOrInput<PLATFORM extends Platform> =
  | JovoInput
  | PlatformTypes<PLATFORM>['request'];

export type JovoRequestObject<PLATFORM extends Platform> =
  | PlatformTypes<PLATFORM>['request']
  // eslint-disable-next-line @typescript-eslint/ban-types
  | OmitWhere<PlatformTypes<PLATFORM>['request'], Function>;

export type PartialRequestOrInput<PLATFORM extends Platform> =
  | RequestOrInput<PLATFORM>
  | JovoInputObject
  | JovoRequestObject<PLATFORM>;

export interface TestSuiteConfig<PLATFORM extends Platform> extends PluginConfig {
  userId: string;
  dbDirectory: string;
  dbFileName: string;
  platform: Constructor<PLATFORM>;
  // TODO
  // platforms: Constructor<PLATFORM>[];
  locale?: string;
  deleteDbOnSessionEnded?: boolean;
}

export interface TestSuite<PLATFORM extends Platform>
  extends Jovo,
    Plugin<TestSuiteConfig<PLATFORM>> {}
export class TestSuite<PLATFORM extends Platform = TestPlatform> extends Plugin<
  TestSuiteConfig<PLATFORM>
> {
  private requestOrInput!: RequestOrInput<PLATFORM>;
  private app: App;

  readonly requestBuilder!: RequestBuilder<PLATFORM>;

  // Platform-specific typings for Jovo properties
  $request!: PlatformTypes<PLATFORM>['request'];
  $response!: TestSuiteResponse<PLATFORM>['response'];
  $device!: PlatformTypes<PLATFORM>['device'];
  $user!: PlatformTypes<PLATFORM>['user'];
  $platform!: PLATFORM;

  constructor(
    config: Partial<TestSuiteConfig<PLATFORM>> = {
      platform: TestPlatform as unknown as Constructor<PLATFORM>,
    },
  ) {
    super(config);

    // Load app from configured stage and register testplugins
    this.app = this.loadApp();
    this.app.use(this, new TestPlatform(), new TestDb({ dbDirectory: this.config.dbDirectory }));

    const platform = new this.config.platform();
    this.requestBuilder = new platform.requestBuilder();

    const request = platform.createRequestInstance({});
    const server: TestServer = new TestServer(request);
    const handleRequest: HandleRequest = new HandleRequest(this.app, server);

    Object.assign(this, new platform.jovoClass(this.app, handleRequest, platform));
  }

  getDefaultConfig(): TestSuiteConfig<PLATFORM> {
    const userId: string = this.generateRandomUserId();
    return {
      dbDirectory: '../db/tests/',
      userId,
      dbFileName: `${userId}-${Date.now()}.json`,
      platform: TestPlatform as unknown as Constructor<PLATFORM>,
      stage: 'dev',
    };
  }

  async run(input: JovoInputObject): Promise<TestSuiteResponse<PLATFORM>>;
  async run(request: JovoRequestObject<PLATFORM>): Promise<TestSuiteResponse<PLATFORM>>;
  async run(requestOrInput: PartialRequestOrInput<PLATFORM>): Promise<TestSuiteResponse<PLATFORM>> {
    // If requestOrInput is not an instance, create one
    const isInputObject = (input: PartialRequestOrInput<PLATFORM>): input is JovoInput =>
      !(input instanceof JovoInput) && !!(input as JovoInput).type;

    const isRequestObject = (request: PartialRequestOrInput<PLATFORM>): request is JovoRequest => {
      return !(request instanceof JovoRequest) && !(request as JovoInput).type;
    };

    if (isInputObject(requestOrInput)) {
      requestOrInput = new JovoInput(requestOrInput);
    }

    if (isRequestObject(requestOrInput)) {
      requestOrInput = this.$platform.createRequestInstance(requestOrInput);
    }

    this.requestOrInput = requestOrInput as RequestOrInput<PLATFORM>;

    await this.app.initialize();

    const request: PlatformTypes<PLATFORM>['request'] = this.isRequestInstance(
      requestOrInput as RequestOrInput<PLATFORM>,
    )
      ? (requestOrInput as JovoRequest)
      : this.requestBuilder.launch();

    await this.app.handle(new TestServer(request));

    return {
      response: this.$response as PlatformResponseType<
        PLATFORM,
        PlatformTypes<PLATFORM>['response']
      >,
      output: this.$output,
    };
  }

  install(app: App): void {
    app.middlewareCollection.use(
      'before.request.start',
      this.saveUserData.bind(this),
      this.setInput.bind(this),
    );
    app.middlewareCollection.use('after.response.end', this.postProcess.bind(this));
  }

  getDbPath(): string {
    return joinPaths(this.config.dbDirectory, `${this.config.userId}.json`);
  }

  /**
   * Saves user data before running the RIDR lifecycle
   */
  private saveUserData(): void {
    if (Object.keys(this.$user.data).length === 0) {
      return;
    }

    if (!existsSync(this.config.dbDirectory)) {
      mkdirSync(this.config.dbDirectory, { recursive: true });
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

  private setInput(jovo: Jovo) {
    if (!this.isRequestInstance(this.requestOrInput)) {
      jovo.$input = this.requestOrInput;
    }

    // Reset session data if a new session is incoming
    if (jovo.$request.isNewSession() === undefined || jovo.$request.isNewSession()) {
      this.$session = new JovoSession();
    }

    _merge(jovo.$user.data, this.$user.data);
    _merge(jovo.$session, this.$session);

    jovo.$request.setUserId(this.config.userId);

    if (this.config.locale) {
      jovo.$request.setLocale(this.config.locale);
    }
  }

  private postProcess(jovo: Jovo): void {
    // Set session data
    jovo.$session.isNew = false;

    Object.assign(this, jovo);

    // Clear db if necessary
    if (this.config.deleteDbOnSessionEnded) {
      const responses: JovoResponse[] = Array.isArray(this.response)
        ? this.response
        : [this.response];

      for (const response of responses) {
        if (response.hasSessionEnded!()) {
          this.clearDb();
          break;
        }
      }
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
        const app = require(appFilePath).app;

        if (!app) {
          continue;
        }

        // TODO: Instead of cloning the entire app, it'd be sufficient to
        // implement app.middlewareCollection.once() to run handlers once per lifecycle
        return _cloneDeep(app) as App;
      }
    }

    throw new JovoError({ message: 'App not found.' });
  }

  private isRequestInstance(request: RequestOrInput<PLATFORM>): request is JovoRequest {
    return request instanceof JovoRequest;
  }

  private clearDb(): void {
    const dbPath: string = this.getDbPath();

    if (!existsSync(dbPath)) {
      unlinkSync(dbPath);
    }
  }

  private generateRandomUserId() {
    return Math.random().toString(36).substring(7);
  }
}
