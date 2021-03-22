import _merge from 'lodash.merge';
import { ArrayElement, Middleware, RegisteredComponents } from '.';
import { ComponentConstructor, ComponentDeclaration } from './BaseComponent';
import { DuplicateChildComponentsError } from './errors/DuplicateChildComponentsError';
import { DuplicateGlobalIntentsError } from './errors/DuplicateGlobalIntentsError';
import { MatchingPlatformNotFoundError } from './errors/MatchingPlatformNotFoundError';
import { Extensible, ExtensibleConfig, ExtensibleInitConfig } from './Extensible';
import { HandleRequest } from './HandleRequest';
import { Host } from './Host';
import { RegisteredComponentMetadata } from './metadata/ComponentMetadata';
import { HandlerMetadata } from './metadata/HandlerMetadata';
import { MetadataStorage } from './metadata/MetadataStorage';
import { MiddlewareCollection } from './MiddlewareCollection';
import { Platform } from './Platform';
import { HandlerPlugin } from './plugins/HandlerPlugin';
import { OutputPlugin } from './plugins/OutputPlugin';
import { RouterPlugin } from './plugins/RouterPlugin';

export interface AppConfig extends ExtensibleConfig {
  placeholder: string;
}

export type AppInitConfig = ExtensibleInitConfig<AppConfig> & {
  components?: Array<ComponentConstructor | ComponentDeclaration>;
};

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
  readonly config: AppConfig = {
    placeholder: '',
  };
  readonly middlewareCollection = new MiddlewareCollection(...BASE_APP_MIDDLEWARES);

  readonly components: RegisteredComponents;

  constructor(config?: AppInitConfig) {
    super(config ? { ...config, components: undefined } : config);
    this.use(new RouterPlugin(), new HandlerPlugin(), new OutputPlugin());
    this.components = {};
    if (config?.components && config?.components?.length) {
      this.useComponents(
        ...(config.components as Array<ComponentConstructor | ComponentDeclaration>),
      );
    }
  }

  get platforms(): ReadonlyArray<Platform> {
    return Object.values(this.plugins).filter((plugin) => plugin instanceof Platform) as Platform[];
  }

  middleware(name: ArrayElement<AppBaseMiddlewares>): Middleware | undefined;
  middleware(name: string): Middleware | undefined;
  middleware(name: string | ArrayElement<AppBaseMiddlewares>): Middleware | undefined {
    return this.middlewareCollection.get(name);
  }

  getDefaultConfig(): AppConfig {
    return {
      plugin: {},
      placeholder: '',
    };
  }

  async initialize(): Promise<void> {
    // TODO populate this.config from the loaded global configuration via file or require or similar
    this.checkForDuplicateGlobalHandlers();
    return this.initializePlugins();
  }

  mount(): Promise<void> | void {
    return;
  }

  useComponents<T extends Array<ComponentConstructor | ComponentDeclaration>>(...components: T) {
    this.registerComponentsIn(this, ...components);
  }

  // TODO finish Host-related things
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async handle(request: Record<string, any>): Promise<any> {
    const handleRequest = new HandleRequest(this, request, new Host());
    await handleRequest.mount();

    await handleRequest.middlewareCollection.run('request', handleRequest);

    const relatedPlatform = this.platforms.find((platform) => platform.isRequestRelated(request));
    if (!relatedPlatform) {
      throw new MatchingPlatformNotFoundError();
    }
    const jovo = relatedPlatform.createJovoInstance(this, handleRequest);

    // RIDR-pipeline
    await handleRequest.middlewareCollection.run('interpretation.asr', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('interpretation.nlu', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('dialog.context', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('dialog.logic', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response.output', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response.tts', handleRequest, jovo);
    await handleRequest.middlewareCollection.run('response', handleRequest, jovo);

    return jovo.$response;
  }

  private registerComponentsIn<T extends Array<ComponentConstructor | ComponentDeclaration>>(
    to: App | RegisteredComponentMetadata,
    ...components: T
  ) {
    for (let i = 0, len = components.length; i < len; i++) {
      const component = components[i];
      const constructor = typeof component === 'function' ? component : component.component;
      const relatedMetadata = MetadataStorage.getInstance().getComponentMetadata(constructor);
      const mergedOptions = _merge(
        {},
        relatedMetadata?.options || {},
        typeof component === 'function' ? {} : component.options || {},
      );
      const componentName = mergedOptions.name || constructor.name;
      const registeredMetadata = new RegisteredComponentMetadata(constructor, mergedOptions);

      if (to.components?.[componentName]) {
        throw new DuplicateChildComponentsError(componentName, to.constructor.name);
      }

      if (mergedOptions.components?.length) {
        registeredMetadata.components = {};
        this.registerComponentsIn(registeredMetadata, ...mergedOptions.components);
      }

      if (!to.components && !(to instanceof App)) {
        to.components = {};
      }
      to.components![componentName] = registeredMetadata;
    }
  }

  private checkForDuplicateGlobalHandlers() {
    const globalHandlerMap: Record<string, HandlerMetadata[]> = {};
    this.checkForDuplicateGlobalHandlersInComponents(this.components, globalHandlerMap);
    const duplicateHandlerEntries = Object.entries(globalHandlerMap).filter(
      ([, handlers]) => handlers.length > 1,
    );
    if (duplicateHandlerEntries.length) {
      throw new DuplicateGlobalIntentsError(duplicateHandlerEntries);
    }
  }

  private checkForDuplicateGlobalHandlersInComponents(
    components: RegisteredComponents,
    globalHandlerMap: Record<string, HandlerMetadata[]>,
  ) {
    const componentNames = Object.keys(components);
    for (let i = 0, len = componentNames.length; i < len; i++) {
      const component = components[componentNames[i]];
      if (!component) {
        continue;
      }
      this.registerGlobalHandlers(component.target, globalHandlerMap);

      if (component.components) {
        this.checkForDuplicateGlobalHandlersInComponents(component.components, globalHandlerMap);
      }
    }
  }

  private registerGlobalHandlers(
    // eslint-disable-next-line @typescript-eslint/ban-types
    constructor: ComponentConstructor | Function,
    globalHandlerMap: Record<string, HandlerMetadata[]>,
  ) {
    const relatedHandlerMetadata = MetadataStorage.getInstance().getHandlerMetadataOfComponent(
      constructor,
    );
    for (let i = 0, len = relatedHandlerMetadata.length; i < len; i++) {
      for (let j = 0, jLen = relatedHandlerMetadata[i].globalIntentNames.length; j < jLen; j++) {
        const globalIntentName = relatedHandlerMetadata[i].globalIntentNames[j];
        if (!globalHandlerMap[globalIntentName]) {
          globalHandlerMap[globalIntentName] = [];
        }
        // TODO: improve condition
        if (!relatedHandlerMetadata[i].hasCondition) {
          globalHandlerMap[globalIntentName].push(relatedHandlerMetadata[i]);
        }
      }
    }
  }
}
