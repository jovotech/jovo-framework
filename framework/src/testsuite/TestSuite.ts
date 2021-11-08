import { Constructor, JovoError, OmitWhere } from '@jovotech/common';
import {
  JovoResponse,
  OutputTemplate,
  OutputTemplateConverterStrategyConfig,
  SingleResponseOutputTemplateConverterStrategy,
} from '@jovotech/output';
import { existsSync } from 'fs';
import _cloneDeep from 'lodash.clonedeep';
import _merge from 'lodash.merge';
import { join as joinPaths } from 'path';
import { PartialDeep } from 'type-fest';
import { v4 as uuidv4 } from 'uuid';
import {
  App,
  Jovo,
  JovoRequest,
  JovoSession,
  Platform,
  Plugin,
  PluginConfig,
  RequestBuilder,
} from '..';
import { HandleRequest } from '../HandleRequest';
import { InputType, JovoInput, JovoInputObject } from '../JovoInput';
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
  output: OutputTemplate[];
  response: PlatformResponseType<PLATFORM, PlatformTypes<PLATFORM>['response']>;
};

export type RequestOrInput<PLATFORM extends Platform> =
  | JovoInput
  | PlatformTypes<PLATFORM>['request'];

export type JovoRequestObject<PLATFORM extends Platform> = OmitWhere<
  PlatformTypes<PLATFORM>['request'],
  // eslint-disable-next-line @typescript-eslint/ban-types
  Function
>;

export type JovoRequestLike<PLATFORM extends Platform> =
  | PlatformTypes<PLATFORM>['request']
  | PlatformTypes<PLATFORM>['request'][]
  | JovoRequestObject<PLATFORM>
  | JovoRequestObject<PLATFORM>[];

export type JovoInputLike = JovoInput | JovoInput[] | JovoInputObject | JovoInputObject[];

export type RequestOrInputLike<PLATFORM extends Platform> =
  | JovoRequestLike<PLATFORM>
  | JovoInputLike;

export interface TestSuiteConfig<PLATFORM extends Platform> extends PluginConfig {
  userId: string;
  platform: Constructor<PLATFORM>;
  locale: string;
  data: {
    deleteAfterAll: boolean;
    deleteAfterEach: boolean;
  };
  stage: string;
  app?: App;
}

export type PartialTestSuiteConfig<PLATFORM extends Platform> = PartialDeep<
  TestSuiteConfig<PLATFORM>
> &
  Partial<Pick<TestSuiteConfig<PLATFORM>, 'platform'>>;

export interface TestSuite<PLATFORM extends Platform>
  extends Jovo,
    Plugin<TestSuiteConfig<PLATFORM>> {}
export class TestSuite<PLATFORM extends Platform = TestPlatform> extends Plugin<
  TestSuiteConfig<PLATFORM>
> {
  private requestOrInput!: RequestOrInput<PLATFORM>;
  private app: App;
  private requestBuilder: RequestBuilder<PLATFORM>;

  // Platform-specific typings for Jovo properties
  $request!: PlatformTypes<PLATFORM>['request'];
  $response!: TestSuiteResponse<PLATFORM>['response'];
  $device!: PlatformTypes<PLATFORM>['device'];
  $user!: PlatformTypes<PLATFORM>['user'];
  $platform!: PLATFORM;
  $output!: OutputTemplate[];

  constructor(config?: PartialTestSuiteConfig<PLATFORM>) {
    super(config);

    // Load app from configured stage and register testplugins
    this.app = this.config.app || this.loadApp();
    this.app.use(this, new TestPlatform());

    const platform = new this.config.platform();
    this.requestBuilder = new platform.requestBuilder();

    const request = platform.createRequestInstance(this.requestBuilder.launch());
    const server: TestServer = new TestServer(request);
    const handleRequest: HandleRequest = new HandleRequest(this.app, server);

    Object.assign(this, new platform.jovoClass(this.app, handleRequest, platform));

    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { afterEach, afterAll } = require('@jest/globals');
    if (this.config.data.deleteAfterEach) {
      afterEach(this.clearData.bind(this));
    }

    if (this.config.data.deleteAfterAll) {
      afterAll(this.clearData.bind(this));
    }
  }

  getDefaultConfig(): TestSuiteConfig<PLATFORM> {
    return {
      data: {
        deleteAfterEach: true,
        deleteAfterAll: true,
      },
      userId: uuidv4(),
      platform: TestPlatform as unknown as Constructor<PLATFORM>,
      stage: 'dev',
      locale: 'en',
    };
  }

  install(app: App): void {
    app.middlewareCollection.use('before.request.start', this.prepareRequest.bind(this));
    app.middlewareCollection.use('after.response.end', this.postProcess.bind(this));
  }

  async run(input: JovoInputLike): Promise<TestSuiteResponse<PLATFORM>>;
  async run(request: JovoRequestLike<PLATFORM>): Promise<TestSuiteResponse<PLATFORM>>;
  async run(requestOrInput: RequestOrInputLike<PLATFORM>): Promise<TestSuiteResponse<PLATFORM>> {
    const requests = Array.isArray(requestOrInput) ? requestOrInput : [requestOrInput];

    for (const requestLike of requests) {
      const isInputInstance = (input: RequestOrInputLike<PLATFORM>): input is JovoInput =>
        input instanceof JovoInput;

      const isInputObject = (input: RequestOrInputLike<PLATFORM>): input is JovoInput =>
        !isInputInstance(input) &&
        Object.keys(input).some((key) =>
          ['type', 'asr', 'nlu', 'intent', 'entities', 'text', 'audio'].includes(key),
        );

      const isRequestObject = (request: RequestOrInputLike<PLATFORM>): request is JovoRequest => {
        return (
          !(request instanceof JovoRequest) && !isInputInstance(request) && !isInputObject(request)
        );
      };

      // If requestOrInput is a plain object, generate a corresponding
      // instance from it
      this.requestOrInput = isInputObject(requestLike)
        ? new JovoInput(requestLike)
        : isRequestObject(requestLike)
        ? this.$platform.createRequestInstance(requestLike)
        : (requestLike as RequestOrInput<PLATFORM>);

      await this.app.initialize();

      const request: PlatformTypes<PLATFORM>['request'] = this.isRequest(this.requestOrInput)
        ? this.requestOrInput
        : this.requestOrInput.type === InputType.Launch
        ? this.requestBuilder.launch()
        : this.requestBuilder.intent();

      await this.app.handle(new TestServer(request));
    }

    return {
      response: this.$response,
      output: this.$output as OutputTemplate[],
    };
  }

  clearData(): void {
    this.$user = this.$platform.createUserInstance(this);
    this.$session = new JovoSession();
  }

  private prepareRequest(jovo: Jovo) {
    // Reset session data if a new session is incoming
    if (jovo.$request.isNewSession() || jovo.$input.type === InputType.Launch) {
      this.$session = new JovoSession();
    }

    if (!this.isRequest(this.requestOrInput)) {
      jovo.$input = this.requestOrInput;
      jovo.$entities = jovo.getEntityMap();
    }
    _merge(jovo.$user.data, this.$user.data);
    _merge(jovo.$session, this.$session);

    jovo.$request.setUserId(this.config.userId);
    jovo.$request.setLocale(this.config.locale);
  }

  private postProcess(jovo: Jovo): void {
    // Set session data
    jovo.$session.isNew = false;

    Object.assign(this, jovo);
  }

  private loadApp(): App {
    const appDirectory: string[] = [process.cwd(), 'src'];
    const { stage } = this.config;
    const appFileNames: string[] = [`app.${stage}.ts`, `app.${stage}.js`, 'app.ts', 'app.js'];

    for (const appFileName of appFileNames) {
      const appFilePath: string = joinPaths(...appDirectory, appFileName);
      if (existsSync(appFilePath)) {
        try {
          // eslint-disable-next-line @typescript-eslint/no-var-requires
          const { app } = require(appFilePath);

          if (!app) {
            continue;
          }

          // TODO: Instead of cloning the entire app, it'd be sufficient to
          // implement app.middlewareCollection.once() to run handlers once per lifecycle
          return _cloneDeep(app) as App;
        } catch (error) {
          throw new JovoError({ message: 'Failed to load app', details: (error as Error).message });
        }
      }
    }

    throw new JovoError({
      message: 'App not found.',
      hint: 'Try running your tests in the root directory of your project',
    });
  }

  private isRequest(request: RequestOrInput<PLATFORM>): request is JovoRequest {
    return request instanceof JovoRequest;
  }
}
