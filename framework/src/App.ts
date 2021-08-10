import _merge from 'lodash.merge';
import { ArrayElement, ComponentTree, I18NextOptions, IntentMap, Middleware, Plugin } from '.';
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

export interface AppRoutingConfig {
  intentMap?: IntentMap;
  intentsToSkipUnhandled?: string[];
}

export interface AppConfig extends ExtensibleConfig {
  i18n?: I18NextOptions;
  logging?: BasicLoggingConfig | boolean;
  routing?: AppRoutingConfig;
}

export type AppInitConfig = ExtensibleInitConfig<AppConfig> & {
  components?: Array<ComponentConstructor | ComponentDeclaration>;
};

export type Usable = Plugin | ComponentConstructor | ComponentDeclaration;

export type AppBaseMiddlewares = [
  'request',
  'interpretation.asr',
  'interpretation.nlu',
  'dialog.context',
  'dialog.logic',
  'response.output',
  'response.tts',
  'response',
];

export type AppBaseMiddleware = ArrayElement<AppBaseMiddlewares>;

export const BASE_APP_MIDDLEWARES: AppBaseMiddlewares = [
  'request',
  'interpretation.asr',
  'interpretation.nlu',
  'dialog.context',
  'dialog.logic',
  'response.output',
  'response.tts',
  'response',
];

export class App extends Extensible<AppConfig, AppBaseMiddlewares> {
  readonly componentTree: ComponentTree;
  readonly i18n: I18Next;

  constructor(config?: AppInitConfig) {
    super(config ? { ...config, components: undefined } : config);

    if (typeof this.config.logging === 'boolean' && this.config.logging) {
      this.use(new BasicLogging({ request: true, response: true }));
    } else if (typeof this.config.logging === 'object') {
      this.use(new BasicLogging(this.config.logging));
    }

    this.use(new RouterPlugin(), new HandlerPlugin(), new OutputPlugin());

    this.componentTree = new ComponentTree(...(config?.components || []));
    this.i18n = new I18Next(this.config.i18n || {});
  }

  get platforms(): ReadonlyArray<Platform> {
    return Object.values(this.plugins).filter((plugin) => plugin instanceof Platform) as Platform[];
  }

  configure(config: AppInitConfig): void {
    _merge(this.config, { ...config, components: undefined, plugins: undefined });
    const usables: Usable[] = [...(config?.plugins || []), ...(config?.components || [])];
    this.use(...usables);
  }

  initializeMiddlewareCollection(): MiddlewareCollection<AppBaseMiddlewares> {
    return new MiddlewareCollection(...BASE_APP_MIDDLEWARES);
  }

  middleware(name: AppBaseMiddleware): Middleware | undefined;
  middleware(name: string): Middleware | undefined;
  middleware(name: string | AppBaseMiddleware): Middleware | undefined {
    return this.middlewareCollection.get(name);
  }

  getDefaultConfig(): AppConfig {
    return {
      logging: true,
    };
  }

  async initialize(): Promise<void> {
    await this.i18n.initialize();
    return this.initializePlugins();
  }

  use<T extends Usable[]>(...usables: T): this {
    const plugins = usables.filter((usable) => usable instanceof Plugin) as Plugin[];
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
    const handleRequest = new HandleRequest(this, server);
    await handleRequest.mount();

    const relatedPlatform = handleRequest.platforms.find((platform) =>
      platform.isRequestRelated(server.getRequestObject()),
    );
    if (!relatedPlatform) {
      throw new MatchingPlatformNotFoundError(server.getRequestObject());
    }
    handleRequest.$platform = relatedPlatform;
    const jovo = relatedPlatform.createJovoInstance(this, handleRequest);

    // RIDR-pipeline
    await handleRequest.middlewareCollection.run('request', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('interpretation.asr', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('interpretation.nlu', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('dialog.context', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('dialog.logic', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response.output', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response.tts', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response', handleRequest, jovo);

    await handleRequest.dismount();

    // TODO determine what to do if there is not response
    if (!jovo.$response) {
      return;
    }

    await server.setResponse(jovo.$response);
  }
}
