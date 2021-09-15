import {
  JovoResponse,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { existsSync, mkdirSync, readFileSync, unlinkSync, writeFileSync } from 'fs';
import _merge from 'lodash.merge';
import _cloneDeep from 'lodash.clonedeep';
import { join as joinPaths } from 'path';
import {
  App,
  Constructor,
  Jovo,
  JovoError,
  JovoRequest,
  JovoSession,
  Platform,
  Plugin,
  PluginConfig,
  RequestBuilder,
  TestRequest,
} from '..';
import { HandleRequest } from '../HandleRequest';
import { JovoInput } from '../JovoInput';
import { TestDb } from './TestDb';
import { TestPlatform } from './TestPlatform';
import { TestServer } from './TestServer';

export type PlatformTypes<PLATFORM extends Platform> = PLATFORM extends Platform<
  infer REQUEST,
  infer RESPONSE,
  infer JOVO,
  infer USER,
  infer DEVICE
>
  ? { request: REQUEST; response: RESPONSE; jovo: JOVO; user: USER; device: DEVICE }
  : never;

export type PlatformResponseType<PLATFORM extends Platform, RESPONSE extends JovoResponse> =
  PLATFORM['outputTemplateConverterStrategy'] extends SingleResponseOutputTemplateConverterStrategy<
    RESPONSE,
    OutputTemplateConverterStrategyConfig
  >
    ? RESPONSE
    : RESPONSE | RESPONSE[];

export type TestSuiteResponse<PLATFORM extends Platform> = {
  output: OutputTemplate | OutputTemplate[];
  response: PlatformResponseType<PLATFORM, PlatformTypes<PLATFORM>['response']>;
};

export interface TestSuiteConfig<PLATFORM extends Platform> extends PluginConfig {
  userId: string;
  dbDirectory: string;
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
  private requestOrInput!: JovoRequest | JovoInput;
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
    Object.assign(this, platform.createJovoInstance(this.app, handleRequest));
  }

  getDefaultConfig(): TestSuiteConfig<PLATFORM> {
    return {
      dbDirectory: '../db/tests/',
      userId: this.generateRandomUserId(),
      platform: TestPlatform as unknown as Constructor<PLATFORM>,
      stage: 'dev',
    };
  }

  async run(
    requestOrInput: Exclude<JovoRequest, () => unknown> | Exclude<JovoInput, () => unknown>,
  ): Promise<TestSuiteResponse<PLATFORM>> {
    this.requestOrInput = requestOrInput;

    await this.app.initialize();

    const request: JovoRequest = this.prepareRequest();
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
      (jovo: Jovo) => {
        return this.setInput(jovo);
      },
    );
    app.middlewareCollection.use('after.response.end', this.postProcess.bind(this));
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
    if (!this.isRequest(this.requestOrInput)) {
      jovo.$input = this.requestOrInput;
    }

    // Reset session data if a new session is incoming
    if (jovo.$request.isNewSession() === undefined || jovo.$request.isNewSession()) {
      this.$session = new JovoSession();
    }

    _merge(jovo.$user, this.$user);
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

        return _cloneDeep(app) as App;
      }
    }

    throw new JovoError({ message: 'App not found.' });
  }

  private prepareRequest(): JovoRequest {
    let request: JovoRequest;

    if (this.isRequest(this.requestOrInput)) {
      request = this.requestOrInput;
    } else {
      // TODO: Solve this in a more elegant way
      request = this.requestBuilder.launch();
    }

    return request;
  }

  private isRequest(requestOrInput: JovoRequest | JovoInput): requestOrInput is JovoRequest {
    return requestOrInput instanceof JovoRequest;
  }

  private clearDb(): void {
    const dbPath: string = this.getDbPath();

    if (!existsSync(dbPath)) {
      // TODO: Throw error?
      return;
    }

    unlinkSync(dbPath);
  }

  getDbPath(): string {
    return joinPaths(this.config.dbDirectory, `${this.config.userId}.json`);
  }

  private generateRandomUserId() {
    return Math.random().toString(36).substring(7);
  }
}
