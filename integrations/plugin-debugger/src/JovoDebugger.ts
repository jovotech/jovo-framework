import {
  AnyObject,
  App,
  DeepPartial,
  Extensible,
  HandleRequest,
  InvalidParentError,
  Jovo,
  JovoRequest,
  NluPlugin,
  Platform,
  Plugin,
  PluginConfig,
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
import { Writable } from 'stream';
import { v4 as uuidV4 } from 'uuid';
import { DebuggerConfig } from './DebuggerConfig';
import { LanguageModelDirectoryNotFoundError } from './errors/LanguageModelDirectoryNotFoundError';
import { SocketConnectionFailedError } from './errors/SocketConnectionFailedError';
import { SocketNotConnectedError } from './errors/SocketNotConnectedError';
import { WebhookIdNotFoundError } from './errors/WebhookIdNotFoundError';
import { JovoDebuggerPayload, JovoUpdateData, StateMutatingJovoMethodKey } from './interfaces';
import { MockServer } from './MockServer';

export enum JovoDebuggerEvent {
  DebuggingAvailable = 'debugging.available',
  DebuggingUnavailable = 'debugging.unavailable',

  DebuggerRequest = 'debugger.request',

  AppLanguageModelResponse = 'app.language-model-response',
  AppDebuggerConfigResponse = 'app.debugger-config-response',
  AppConsoleLog = 'app.console-log',
  AppRequest = 'app.request',
  AppResponse = 'app.response',

  AppJovoUpdate = 'app.jovo-update',
}

export interface JovoDebuggerConfig extends PluginConfig {
  nlu: NluPlugin;
  webhookUrl: string;
  debuggerConfigPath: string;
  modelsPath: string;
  ignoredProperties: Array<keyof Jovo | string>;
}

export type JovoDebuggerInitConfig = DeepPartial<JovoDebuggerConfig> &
  Partial<Pick<JovoDebuggerConfig, 'nlpjsNlu'>>;

export function getDefaultLanguageMap(): UnknownObject {
  return {
    de: LangDe,
    en: LangEn,
    es: LangEs,
    fr: LangFr,
    it: LangIt,
  };
}

export const STATE_MUTATING_METHOD_KEYS = ['$redirect', '$delegate', '$resolve'] as const;

export class JovoDebugger extends Plugin<JovoDebuggerConfig> {
  socket?: typeof Socket;
  hasOverriddenWrite = false;

  constructor(config?: JovoDebuggerInitConfig) {
    super(config);
  }

  getDefaultConfig(): JovoDebuggerConfig {
    return {
      skipTests: true,
      nlu: new NlpjsNlu({
        languageMap: getDefaultLanguageMap(),
      }),
      webhookUrl: 'https://webhookv4.jovo.cloud',
      enabled:
        (process.argv.includes('--jovo-webhook') || process.argv.includes('--webhook')) &&
        !process.argv.includes('--disable-jovo-debugger'),
      debuggerConfigPath: './jovo.debugger.js',
      modelsPath: './models',
      ignoredProperties: ['$app', '$handleRequest', '$platform'],
    };
  }

  install(parent: Extensible): void {
    if (!(parent instanceof App)) {
      throw new InvalidParentError(this.constructor.name, App);
    }
    this.installDebuggerPlatform(parent);
  }

  private installDebuggerPlatform(app: App) {
    app.use(
      new CorePlatform({
        platform: 'jovo-debugger',
        plugins: [this.config.nlu],
      }),
    );
  }

  async initialize(app: App): Promise<void> {
    if (this.config.enabled === false) return;

    this.socket = await this.connectToWebhook();
    this.socket.on(JovoDebuggerEvent.DebuggingAvailable, () => {
      return this.onDebuggingAvailable();
    });
    this.socket.on(JovoDebuggerEvent.DebuggerRequest, (request: AnyObject) => {
      return this.onDebuggerRequest(app, request);
    });

    this.patchHandleRequestToIncludeUniqueId();
    this.patchPlatformsToCreateJovoAsProxy(app.platforms);
  }

  mount(parent: HandleRequest): Promise<void> | void {
    this.socket = parent.app.plugins.JovoDebugger?.socket;
    parent.middlewareCollection.use('request.start', (jovo) => {
      return this.onRequest(jovo);
    });
    parent.middlewareCollection.use('response.end', (jovo) => {
      return this.onResponse(jovo);
    });
  }

  emitUpdate(requestId: string | number, data: JovoUpdateData): void {
    const payload: JovoDebuggerPayload<JovoUpdateData> = {
      requestId,
      data,
    };
    this.socket?.emit(JovoDebuggerEvent.AppJovoUpdate, payload);
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
          const value = jovo[key as keyof Jovo];
          const isEmptyObject =
            typeof value === 'object' && !Array.isArray(value) && !Object.keys(value || {}).length;
          const isEmptyArray = Array.isArray(value) && !((value as unknown[]) || []).length;

          if (
            !jovo.hasOwnProperty(key) ||
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
        // only emit changes
        if (!isEqual(previousValue, value)) {
          const stringKey = key.toString();
          this.emitUpdate(handleRequest.debuggerRequestId, {
            key: stringKey,
            value,
            path: getCompletePropertyPath(stringKey, currentPath),
          });
        }

        return true;
      },
    };
  }

  private createStateMutationProxyHandler<KEY extends StateMutatingJovoMethodKey>(
    handleRequest: HandleRequest,
    key: KEY,
  ): ProxyHandler<Jovo[KEY]> {
    return {
      apply(target: any, thisArg: Jovo, argArray: any[]): any {
        // TODO implement setting and sending of data
        return target.apply(thisArg, argArray);
      },
    };
  }

  private async onDebuggingAvailable(): Promise<void> {
    if (!this.socket) {
      throw new SocketNotConnectedError(this.config.webhookUrl);
    }

    await this.emitDebuggerConfig();
    await this.emitLanguageModelIfEnabled();

    function propagateStreamAsLog(stream: Writable, socket: typeof Socket) {
      const originalWriteFn = stream.write;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      stream.write = function (chunk: Buffer, ...args: any[]) {
        socket.emit(JovoDebuggerEvent.AppConsoleLog, chunk.toString(), new Error().stack);
        return originalWriteFn.call(this, chunk, ...args);
      };
    }

    if (!this.hasOverriddenWrite) {
      propagateStreamAsLog(process.stdout, this.socket);
      propagateStreamAsLog(process.stderr, this.socket);
      this.hasOverriddenWrite = true;
    }
  }

  private async onDebuggerRequest(app: App, request: AnyObject): Promise<void> {
    await app.handle(new MockServer(request));
  }

  private onRequest(jovo: Jovo): void {
    if (!this.socket) {
      throw new SocketNotConnectedError(this.config.webhookUrl);
    }
    const payload: JovoDebuggerPayload<JovoRequest> = {
      requestId: jovo.$handleRequest.debuggerRequestId,
      data: jovo.$request,
    };
    this.socket.emit(JovoDebuggerEvent.AppRequest, payload);
  }

  private onResponse(jovo: Jovo): void {
    if (!this.socket) {
      throw new SocketNotConnectedError(this.config.webhookUrl);
    }
    const payload: JovoDebuggerPayload = {
      requestId: jovo.$handleRequest.debuggerRequestId,
      data: jovo.$response,
    };
    this.socket.emit(JovoDebuggerEvent.AppResponse, payload);
  }

  private async emitLanguageModelIfEnabled(): Promise<void> {
    if (!this.config.modelsPath) {
      return;
    }
    if (!this.socket) {
      throw new SocketNotConnectedError(this.config.webhookUrl);
    }
    try {
      const languageModel = await this.loadLanguageModel();
      this.socket.emit(JovoDebuggerEvent.AppLanguageModelResponse, languageModel);
    } catch (e) {
      return;
    }
  }

  // Return the language models found at the configured location
  private async loadLanguageModel(): Promise<AnyObject> {
    const languageModel: AnyObject = {};
    const absoluteModelsPath = resolve(cwd(), this.config.modelsPath);
    let files: string[] = [];
    try {
      files = await promises.readdir(absoluteModelsPath);
    } catch (e) {
      throw new LanguageModelDirectoryNotFoundError(absoluteModelsPath);
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
      throw new SocketNotConnectedError(this.config.webhookUrl);
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
      console.warn('Error occurred while loading debugger-config, using default config.');
      console.warn(e.message);
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
    socket.on('connect_error', (error: Error) => {
      throw new SocketConnectionFailedError(this.config.webhookUrl, error);
    });
    return socket;
  }

  private async retrieveLocalWebhookId(): Promise<string> {
    const homeConfigPath = resolve(homedir(), '.jovo/configv4');
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

  // Require the module and clear cache if there is any
  // This is useful for being able to use changed js-files
  private requireUncached(module: string) {
    delete require.cache[require.resolve(module)];
    return require(module);
  }
}
