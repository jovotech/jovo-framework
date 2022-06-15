import {
  AnyObject,
  App,
  BuiltInHandler,
  ComponentTreeNode,
  Extensible,
  HandleRequest,
  InvalidParentError,
  Jovo,
  JovoRequest,
  NluPlugin,
  Platform,
  Plugin,
  PluginConfig,
  Server,
  SluPlugin,
  UnknownObject,
} from '@jovotech/framework';
import { NlpjsNlu } from '@jovotech/nlu-nlpjs';
import { CorePlatform } from '@jovotech/platform-core';
import { LangDe } from '@nlpjs/lang-de';
import { LangEn } from '@nlpjs/lang-en';
import { LangEs } from '@nlpjs/lang-es';
import { LangFr } from '@nlpjs/lang-fr';
import { LangIt } from '@nlpjs/lang-it';
import isEqual from 'fast-deep-equal/es6';
import { promises } from 'fs';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { cwd } from 'process';
import { connect, Socket } from 'socket.io-client';
import { inspect } from 'util';
import { v4 as uuidV4 } from 'uuid';
import { STATE_MUTATING_METHOD_KEYS } from './constants';
import { DebuggerConfig } from './DebuggerConfig';
import { JovoDebuggerEvent } from './enums';
import { LanguageModelDirectoryNotFoundError } from './errors/LanguageModelDirectoryNotFoundError';
import { SocketConnectionFailedError } from './errors/SocketConnectionFailedError';
import { SocketNotConnectedError } from './errors/SocketNotConnectedError';
import { WebhookIdNotFoundError } from './errors/WebhookIdNotFoundError';
import {
  JovoDebuggerPayload,
  JovoStateMutationData,
  JovoUpdateData,
  StateMutatingJovoMethodKey,
} from './interfaces';
import { MockServer, MockServerRequest } from './MockServer';
import _cloneDeep from 'lodash.clonedeep';

type AugmentedServer = Server &
  AnyObject & {
    __augmented?: boolean;
    originalSetResponse?: Server['setResponse'];
  };

export interface JovoDebuggerConfig extends PluginConfig {
  nlu: NluPlugin | SluPlugin;
  webhookUrl: string;
  debuggerConfigPath: string;
  modelsPath: string;
  ignoredProperties: Array<keyof Jovo | string>;
  plugins: Plugin[];
}

export function getDefaultLanguageMap(): UnknownObject {
  return {
    de: LangDe,
    en: LangEn,
    es: LangEs,
    fr: LangFr,
    it: LangIt,
  };
}

export class JovoDebuggerPlatform extends CorePlatform<'JovoDebuggerPlatform'> {}

export class JovoDebugger extends Plugin<JovoDebuggerConfig> {
  socket?: typeof Socket;
  hasOverriddenWrite = false;
  hasShownConnectionError = false;

  getDefaultConfig(): JovoDebuggerConfig {
    return {
      skipTests: true,
      nlu: new NlpjsNlu({
        languageMap: getDefaultLanguageMap(),
      }),
      webhookUrl: 'https://webhook.jovo.cloud',
      enabled:
        (process.argv.includes('--jovo-webhook') || process.argv.includes('--webhook')) &&
        !process.argv.includes('--disable-jovo-debugger'),
      debuggerConfigPath: './jovo.debugger.js',
      modelsPath: './models',
      ignoredProperties: ['$app', '$handleRequest', '$platform'],
      plugins: [],
    };
  }

  install(parent: Extensible): void {
    if (!(parent instanceof App)) {
      throw new InvalidParentError(this.name, App);
    }
    this.installDebuggerPlatform(parent);
  }

  private installDebuggerPlatform(app: App) {
    const plugins: Plugin[] = (this.config.plugins as Plugin[]) || [];

    app.use(
      new JovoDebuggerPlatform({
        platform: 'jovo-debugger',
        plugins: [this.config.nlu, ...plugins],
      }),
    );
  }

  async initialize(app: App): Promise<void> {
    if (this.config.enabled === false) return;

    this.socket = await this.connectToWebhook();
    this.socket.on(JovoDebuggerEvent.DebuggingAvailable, () => {
      return this.onDebuggingAvailable();
    });
    this.socket.on(JovoDebuggerEvent.DebuggerRequest, (requestData: AnyObject) => {
      return this.onReceiveRequest(app, { data: requestData });
    });
    this.socket.on(JovoDebuggerEvent.ServerRequest, (request: MockServerRequest) => {
      return this.onReceiveRequest(app, request);
    });

    this.augmentServerForApp(app);
    this.patchHandleRequestToIncludeUniqueId();
    this.patchPlatformsToCreateJovoAsProxy(app.platforms);
  }

  mount(parent: HandleRequest): Promise<void> | void {
    this.augmentServerForRequest(parent);

    // Because the socket does not work properly after being cloned, the instance from the app plugin has to be used
    this.socket = parent.app.plugins.JovoDebugger?.socket;
    parent.middlewareCollection.use('request.start', (jovo) => {
      return this.onRequest(jovo);
    });
  }

  emitUpdate(requestId: string | number, data: JovoUpdateData): void {
    const payload: JovoDebuggerPayload<JovoUpdateData> = {
      requestId,
      data,
    };
    this.socket?.emit(JovoDebuggerEvent.AppJovoUpdate, payload);
  }

  emitStateMutation(requestId: string | number, data: JovoStateMutationData): void {
    const payload: JovoDebuggerPayload<JovoStateMutationData> = {
      requestId,
      data,
    };
    this.socket?.emit(JovoDebuggerEvent.AppStateMutation, payload);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/explicit-module-boundary-types
  emitResponse(response: any, requestId?: string | number): void {
    if (!this.socket) {
      return this.onSocketNotConnected();
    }
    const payload: JovoDebuggerPayload = {
      requestId,
      data: response,
    };
    this.socket.emit(JovoDebuggerEvent.AppResponse, payload);
  }

  // Augment the server given in app.handle to emit a response event when setResponse is called
  private augmentServerForApp(app: App): void {
    const handle = app.handle;
    app.handle = (server: AugmentedServer) => {
      if (!server.__augmented) {
        const setResponse = server.setResponse;
        server.originalSetResponse = setResponse;
        server.setResponse = (response) => {
          this.emitResponse(response);
          return setResponse.call(server, response);
        };
        server.__augmented = true;
      }
      return handle.call(app, server);
    };
  }

  // Augment the server of HandleRequest to emit a response with a debugger request id if setResponse is called.
  // If the server was already augmented by augmentServerForApp, the original method will be used instead of the already augmented one.
  private augmentServerForRequest(handleRequest: HandleRequest): void {
    const serverCopy: AugmentedServer = Object.create(handleRequest.server);
    for (const prop in handleRequest.server) {
      if (handleRequest.server.hasOwnProperty(prop)) {
        serverCopy[prop] = handleRequest.server[prop as keyof Server];
      }
    }
    const setResponse =
      (serverCopy.__augmented && serverCopy.originalSetResponse) || serverCopy.setResponse;
    serverCopy.setResponse = (response) => {
      this.emitResponse(response, handleRequest.debuggerRequestId);
      return setResponse.call(serverCopy, response);
    };
    Object.defineProperty(handleRequest, 'server', {
      value: serverCopy,
    });
  }

  private patchHandleRequestToIncludeUniqueId() {
    // this cannot be done in a middleware-hook because the debuggerRequestId is required when initializing the jovo instance
    // and that happens before the middlewares are executed
    const mount = HandleRequest.prototype.mount;
    HandleRequest.prototype.mount = function () {
      this.debuggerRequestId = uuidV4();
      return mount.call(this);
    };
  }

  private patchPlatformsToCreateJovoAsProxy(platforms: ReadonlyArray<Platform>) {
    platforms.forEach((platform) => {
      const createJovoFn = platform.createJovoInstance;
      // overwrite createJovoInstance to create a proxy and propagate all initial changes
      platform.createJovoInstance = (app, handleRequest) => {
        const jovo = createJovoFn.call(platform, app, handleRequest);
        // propagate initial values, might not be required, TBD
        for (const key in jovo) {
          if (!jovo.hasOwnProperty(key)) {
            continue;
          }
          const value = jovo[key as keyof Jovo];
          const isEmptyObject =
            typeof value === 'object' && !Array.isArray(value) && !Object.keys(value || {}).length;
          const isEmptyArray = Array.isArray(value) && !((value as unknown[]) || []).length;

          if (
            this.config.ignoredProperties.includes(key) ||
            !value ||
            isEmptyObject ||
            isEmptyArray
          ) {
            continue;
          }
          this.emitUpdate(handleRequest.debuggerRequestId, {
            key,
            value,
            path: key,
          });
        }
        return new Proxy(jovo, this.createObjectProxyHandler(handleRequest));
      };
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private createObjectProxyHandler<T extends Record<string | number | symbol, any>>(
    handleRequest: HandleRequest,
    currentPath = '',
  ): ProxyHandler<T> {
    function getCompletePropertyPath(key: string, path?: string): string {
      return path ? [path, key].join('.') : key;
    }

    // class Foo { bar: string} -> new Proxy(new Foo(), { get() {...}})

    return {
      get: (target, key: keyof T) => {
        const stringKey = key.toString();
        // make __isProxy return true for all proxies with this handler
        if (stringKey === '__isProxy') {
          return true;
        }
        // provide a reference to the original target of the proxy
        if (stringKey === '__target') {
          return target;
        }

        const value = target[key];
        const completePropertyPath = getCompletePropertyPath(stringKey, currentPath);

        // if the value is a function and a state mutating method
        if (
          typeof value === 'function' &&
          Array.from<string>(STATE_MUTATING_METHOD_KEYS).includes(stringKey)
        ) {
          return new Proxy(
            target[key],
            this.createStateMutationProxyHandler(
              handleRequest,
              stringKey as StateMutatingJovoMethodKey,
            ),
          );
        }

        const isSupportedObject =
          value &&
          typeof value === 'object' &&
          !((value as AnyObject) instanceof Date) &&
          !((value as AnyObject) instanceof Jovo);

        const shouldCreateProxy =
          value && !value.__isProxy && !this.config.ignoredProperties.includes(stringKey);

        // if the value is a supported object and not ignored, nor a proxy already
        if (isSupportedObject && shouldCreateProxy) {
          // create the proxy for the value
          const proxy = new Proxy(
            value,
            this.createObjectProxyHandler(handleRequest, completePropertyPath),
          );

          // check if the property is writable, if it's not, return the proxy
          const propertyDescriptor = Object.getOwnPropertyDescriptor(target, key);
          if (!propertyDescriptor?.writable) {
            return proxy;
          }

          // otherwise overwrite the property and set it to the proxy
          target[key as keyof T] = proxy;
        }

        return target[key];
      },
      set: (target, key: keyof T, value: T[keyof T]): boolean => {
        const previousValue = target[key];
        target[key as keyof T] = value;
        const stringKey = key.toString();

        // only emit changes
        if (!isEqual(previousValue, value) && !this.config.ignoredProperties.includes(stringKey)) {
          const stringKey = key.toString();
          this.emitUpdate(handleRequest.debuggerRequestId, {
            key: stringKey,
            value,
            previousValue,
            path: getCompletePropertyPath(stringKey, currentPath),
          });
        }

        return true;
      },
      deleteProperty: (target: T, key: keyof T): boolean => {
        const stringKey = key.toString();
        const copy = _cloneDeep(target);
        delete copy[key];
        this.emitUpdate(handleRequest.debuggerRequestId, {
          key: stringKey,
          value: copy,
          previousValue: target,
          path: currentPath,
        });
        return true;
      },
    };
  }

  private createStateMutationProxyHandler<KEY extends StateMutatingJovoMethodKey>(
    handleRequest: HandleRequest,
    key: KEY,
  ): ProxyHandler<Jovo[KEY]> {
    return {
      // Parameters<Jovo[KEY]> sadly only returns the parameters of the method without generics, therefore unknown[] is used
      apply: (target: Jovo[KEY], thisArg: Jovo, argArray: unknown[]): unknown => {
        const mutationData = this.getStateMutationData(handleRequest, key, thisArg, argArray);
        if (mutationData) {
          this.emitStateMutation(handleRequest.debuggerRequestId, mutationData);
        }
        return (target as (...args: unknown[]) => unknown).apply(thisArg, argArray);
      },
    };
  }

  private getStateMutationData<KEY extends StateMutatingJovoMethodKey>(
    handleRequest: HandleRequest,
    key: KEY,
    jovo: Jovo,
    args: unknown[],
  ): JovoStateMutationData<KEY> | undefined {
    let node: ComponentTreeNode | undefined;
    let handler: string = BuiltInHandler.Start;
    if (key === '$redirect' || key === '$delegate') {
      const componentName =
        typeof args[0] === 'function' && 'name' in args[0] ? args[0].name : (args[0] as string);
      node = handleRequest.componentTree.getNodeRelativeTo(
        componentName,
        handleRequest.activeComponentNode?.path,
      );
      handler = typeof args[1] === 'string' ? args[1] : JSON.stringify(args[1], undefined, 2);
    } else if (key === '$resolve') {
      if (!jovo.$state) {
        return;
      }
      const currentStateStackItem = jovo.$state[jovo.$state.length - 1];
      const previousStateStackItem = jovo.$state[jovo.$state.length - 2];
      // make sure the state-stack exists and it long enough
      if (!currentStateStackItem?.resolve || !previousStateStackItem) {
        return;
      }
      const previousComponentPath = previousStateStackItem.component.split('.');
      node = handleRequest.componentTree.getNodeAt(previousComponentPath);
      handler = currentStateStackItem.resolve[args[0] as string];
    }
    if (!node) {
      return;
    }
    return {
      key,
      to: {
        path: node.path.join('.'),
        handler,
      },
    };
  }

  private async onConnected(): Promise<void> {
    const color: [number, number] = inspect.colors['blue'] ?? [0, 0];
    const blueText = (str: string) => `\u001b[${color[0]}m${str}\u001b[${color[1]}m`;
    const underlineColor: [number, number] = inspect.colors['underline'] ?? [0, 0];
    const underline = (str: string) =>
      `\u001b[${underlineColor[0]}m${str}\u001b[${underlineColor[1]}m`;

    const webhookId = await this.retrieveLocalWebhookId();
    const debuggerUrl = `${this.config.webhookUrl}/${webhookId}`;

    // eslint-disable-next-line no-console
    console.log('\nThis is your webhook url ☁️ ' + underline(blueText(debuggerUrl)));
  }

  private async onDebuggingAvailable(): Promise<void> {
    if (!this.socket) {
      return this.onSocketNotConnected();
    }

    await this.emitDebuggerConfig();
    await this.emitLanguageModelIfEnabled();

    if (!this.hasOverriddenWrite) {
      // disable logging events for now because they are not shown anyways
      // propagateStreamAsLog(process.stdout, this.socket);
      // propagateStreamAsLog(process.stderr, this.socket);
      this.hasOverriddenWrite = true;
    }
  }

  private async onReceiveRequest(app: App, request: MockServerRequest): Promise<void> {
    await app.handle(new MockServer(request));
  }

  private onRequest(jovo: Jovo): void {
    if (!this.socket) {
      return this.onSocketNotConnected();
    }
    const payload: JovoDebuggerPayload<JovoRequest> = {
      requestId: jovo.$handleRequest.debuggerRequestId,
      data: jovo.$request,
    };
    this.socket.emit(JovoDebuggerEvent.AppRequest, payload);
  }

  private async emitLanguageModelIfEnabled(): Promise<void> {
    if (!this.config.modelsPath) {
      return;
    }
    if (!this.socket) {
      return this.onSocketNotConnected();
    }
    try {
      const languageModel = await this.loadLanguageModel();
      if (!languageModel) {
        return;
      }
      this.socket.emit(JovoDebuggerEvent.AppLanguageModelResponse, languageModel);
    } catch (e) {
      return;
    }
  }

  // Return the language models found at the configured location
  private async loadLanguageModel(): Promise<AnyObject | undefined> {
    const languageModel: AnyObject = {};
    const absoluteModelsPath = resolve(cwd(), this.config.modelsPath);
    let files: string[] = [];
    try {
      files = await promises.readdir(absoluteModelsPath);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn(new LanguageModelDirectoryNotFoundError(absoluteModelsPath));
      return;
    }
    const isValidFileRegex = /^.*([.]js(?:on)?)$/;
    for (let i = 0, len = files.length; i < len; i++) {
      const match = isValidFileRegex.exec(files[i]);
      if (!match) {
        continue;
      }
      const locale = files[i].substring(0, files[i].indexOf(match[1]));
      const absoluteFilePath = join(absoluteModelsPath, files[i]);
      if (match[1] === '.json') {
        try {
          const fileBuffer = await promises.readFile(absoluteFilePath);
          languageModel[locale] = JSON.parse(fileBuffer.toString());
        } catch (e) {
          // eslint-disable-next-line no-console
          console.error(e);
        }
      } else {
        languageModel[locale] = this.requireUncached(absoluteModelsPath);
      }
    }
    return languageModel;
  }

  private async emitDebuggerConfig(): Promise<void> {
    if (!this.config.debuggerConfigPath) {
      return;
    }
    if (!this.socket) {
      return this.onSocketNotConnected();
    }
    try {
      const debuggerConfig = await this.loadDebuggerConfig();
      this.socket.emit(JovoDebuggerEvent.AppDebuggerConfigResponse, debuggerConfig);
    } catch (e) {
      return;
    }
  }

  // Return the debugger config at the configured location or return a default config.
  private async loadDebuggerConfig(): Promise<DebuggerConfig> {
    try {
      const absoluteDebuggerConfigPath = resolve(cwd(), this.config.debuggerConfigPath);
      return this.requireUncached(absoluteDebuggerConfigPath);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.info('Error occurred while loading debugger-config, using default config.');
      return new DebuggerConfig();
    }
  }

  private async connectToWebhook(): Promise<typeof Socket> {
    const webhookId = await this.retrieveLocalWebhookId();
    const socket = connect(this.config.webhookUrl, {
      query: {
        id: webhookId,
        type: 'app',
      },
    });
    socket.on('connect', () => {
      this.hasShownConnectionError = false;
      this.onConnected();
    });
    socket.on('connect_error', (error: Error) => {
      if (!this.hasShownConnectionError) {
        // eslint-disable-next-line no-console
        console.warn(new SocketConnectionFailedError(this.config.webhookUrl, error).message);
        this.hasShownConnectionError = true;
      }
    });
    return socket;
  }

  private async retrieveLocalWebhookId(): Promise<string> {
    const homeConfigPath = resolve(homedir(), '.jovo/config');
    try {
      const homeConfigBuffer = await promises.readFile(homeConfigPath);
      const homeConfigData = JSON.parse(homeConfigBuffer.toString());
      if (homeConfigData?.webhook?.uuid) {
        return homeConfigData.webhook.uuid;
      }
      throw new Error();
    } catch (e) {
      throw new WebhookIdNotFoundError(homeConfigPath);
    }
  }

  private onSocketNotConnected() {
    // eslint-disable-next-line no-console
    console.warn(new SocketNotConnectedError(this.config.webhookUrl).message);
  }

  // Require the module and clear cache if there is any
  // This is useful for being able to use changed js-files
  private requireUncached(module: string) {
    delete require.cache[require.resolve(module)];
    return require(module);
  }
}
