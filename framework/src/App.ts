import { ArrayElement, JovoLoggerConfig } from '@jovotech/common';
import _merge from 'lodash.merge';
import {
  ComponentTree,
  I18NextConfig,
  IntentMap,
  Jovo,
  Logger,
  Middleware,
  MiddlewareFunction,
  Plugin,
  PossibleMiddlewareName,
} from '.';
import { ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { MatchingPlatformNotFoundError } from './errors/MatchingPlatformNotFoundError';
import { Extensible, ExtensibleConfig, ExtensibleInitConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { I18Next } from './I18Next';
import { MiddlewareCollection } from './MiddlewareCollection';
import { Platform } from './Platform';
import { BasicLogging, BasicLoggingConfig } from './plugins/BasicLogging';
import { HandlerPlugin } from './plugins/HandlerPlugin';
import { OutputPlugin } from './plugins/OutputPlugin';
import { RouterPlugin } from './plugins/RouterPlugin';
import { Server } from './Server';

export type Usable = Plugin | ComponentConstructor | ComponentDeclaration;

export const APP_MIDDLEWARES = [
  'request.start',
  'request',
  'request.end',
  'interpretation.start',
  'interpretation.asr',
  'interpretation.nlu',
  'interpretation.end',
  'dialogue.start',
  'dialogue.router',
  'dialogue.logic',
  'dialogue.end',
  'response.start',
  'response.output',
  'response.tts',
  'response.end',
] as const;
export type AppMiddleware = ArrayElement<typeof APP_MIDDLEWARES>;
export type AppMiddlewares = AppMiddleware[];

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type AppErrorListener = (error: Error, jovo?: Jovo) => any;

export interface AppRoutingConfig {
  intentMap?: IntentMap;
  intentsToSkipUnhandled?: string[];
}

export interface AppLoggingConfig extends BasicLoggingConfig {
  logger?: Partial<JovoLoggerConfig>;
}

export interface AppConfig extends ExtensibleConfig {
  i18n?: I18NextConfig;
  logging?: AppLoggingConfig | boolean;
  routing?: AppRoutingConfig;
}

export type AppInitConfig = ExtensibleInitConfig<AppConfig> & {
  components?: Array<ComponentConstructor | ComponentDeclaration>;
};

export class App extends Extensible<AppConfig, AppMiddlewares> {
  readonly componentTree: ComponentTree;
  readonly i18n: I18Next;
  private initialized = false;
  private errorListeners: AppErrorListener[] = [];

  constructor(config?: AppInitConfig) {
    super(config ? { ...config, components: undefined } : config);

    if (typeof this.config.logging === 'object' && this.config.logging.logger) {
      _merge(Logger.config, this.config.logging.logger);
    }

    this.onError((error) => {
      Logger.error(error);
    });
    this.use(new RouterPlugin(), new HandlerPlugin(), new OutputPlugin());

    this.componentTree = new ComponentTree(...(config?.components || []));
    this.i18n = new I18Next(this.config.i18n);
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  get platforms(): ReadonlyArray<Platform> {
    return Object.values(this.plugins).filter((plugin) => plugin instanceof Platform) as Platform[];
  }

  configure(config: AppInitConfig): void {
    _merge(this.config, { ...config, components: undefined, plugins: undefined });
    const usables: Usable[] = [...(config?.plugins || []), ...(config?.components || [])];
    this.use(...usables);
  }

  onError(listener: AppErrorListener): void {
    if (this.errorListeners.includes(listener)) {
      return;
    }
    this.errorListeners.push(listener);
  }

  addErrorListener(listener: AppErrorListener): void {
    return this.onError(listener);
  }

  removeErrorListener(listener: AppErrorListener): void {
    const index = this.errorListeners.indexOf(listener);
    if (index >= 0) {
      this.errorListeners.splice(index, 1);
    }
  }

  initializeMiddlewareCollection(): MiddlewareCollection<AppMiddlewares> {
    return new MiddlewareCollection(...APP_MIDDLEWARES);
  }

  middleware(name: PossibleMiddlewareName<AppMiddleware>): Middleware | undefined;
  middleware(name: string): Middleware | undefined;
  middleware(name: PossibleMiddlewareName<AppMiddleware> | string): Middleware | undefined {
    return this.middlewareCollection.get(name);
  }

  hook(name: PossibleMiddlewareName<AppMiddleware>, fn: MiddlewareFunction): void;
  hook(name: string, fn: MiddlewareFunction): void;
  hook(name: PossibleMiddlewareName<AppMiddleware> | string, fn: MiddlewareFunction): void {
    this.middlewareCollection.use(name, fn);
  }

  getDefaultConfig(): AppConfig {
    return {
      logging: true,
    };
  }

  async initialize(): Promise<void> {
    if (this.initialized) {
      return;
    }

    if (typeof this.config.logging === 'boolean' && this.config.logging) {
      this.use(new BasicLogging({ request: true, response: true }));
    } else if (typeof this.config.logging === 'object') {
      if (this.config.logging.logger) {
        _merge(Logger.config, this.config.logging.logger);
      }
      this.use(new BasicLogging(this.config.logging));
    }

    try {
      await this.componentTree.initialize();
      await this.i18n.initialize();
      await this.initializePlugins();
      this.initialized = true;
    } catch (e) {
      return this.handleError(e);
    }
  }

  use<T extends Usable[]>(...usables: T): this {
    const plugins = usables.filter((usable) => {
      if (!(usable instanceof Plugin)) {
        return false;
      }

      if (
        (process.env.NODE_ENV === 'test' || process.env.JEST_WORKER_ID) &&
        (usable as Plugin).config.skipTests
      ) {
        return false;
      }

      return true;
    }) as Plugin[];
    if (plugins.length) {
      super.use(...plugins);
    }
    const components = usables.filter((usable) => !(usable instanceof Plugin)) as Array<
      ComponentConstructor | ComponentDeclaration
    >;
    if (components.length) {
      this.componentTree.add(...components);
    }
    return this;
  }

  async handle(server: Server): Promise<void> {
    try {
      const handleRequest = new HandleRequest(this, server);
      await handleRequest.mount();

      const relatedPlatform = handleRequest.platforms.find((platform) =>
        platform.isRequestRelated(server.getRequestObject()),
      );
      if (!relatedPlatform) {
        throw new MatchingPlatformNotFoundError(server.getRequestObject());
      }
      handleRequest.platform = relatedPlatform;
      const jovo = relatedPlatform.createJovoInstance(this, handleRequest);

      // RIDR-pipeline
      await handleRequest.middlewareCollection.run(APP_MIDDLEWARES.slice(), jovo);

      await handleRequest.dismount();

      // TODO determine what to do if there is not response
      if (!jovo.$response) {
        return;
      }

      // use handleRequest.server instead of server in order to allow a request-related server instance to be used
      await handleRequest.server.setResponse(jovo.$response);
    } catch (e) {
      await this.handleError(e);
      return server.fail(e);
    }
  }

  async handleError(error: unknown, jovo?: Jovo): Promise<void> {
    const errorInstance: Error = error instanceof Error ? error : new Error(error as string);

    if (!this.errorListeners?.length) {
      throw error;
    }

    for (const listener of this.errorListeners) {
      await listener(errorInstance, jovo);
    }
  }
}
