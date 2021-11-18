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
import open from 'open';
import { homedir } from 'os';
import { join, resolve } from 'path';
import { cwd } from 'process';
import { connect, Socket } from 'socket.io-client';
import { Writable } from 'stream';
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

export interface JovoDebuggerConfig extends PluginConfig {
  nlu: NluPlugin;
  webhookUrl: string;
  debuggerConfigPath: string;
  modelsPath: string;
  ignoredProperties: Array<keyof Jovo | string>;
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
    };
  }

  install(parent: Extensible): void {
    if (!(parent instanceof App)) {
      throw new InvalidParentError(this.name, App);
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
    this.socket.on(JovoDebuggerEvent.DebuggerRequest, (requestData: AnyObject) => {
      return this.onReceiveRequest(app, { data: requestData });
    });
    this.socket.on(JovoDebuggerEvent.ServerRequest, (request: MockServerRequest) => {
      return this.onReceiveRequest(app, request);
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

  emitStateMutation(requestId: string | number, data: JovoStateMutationData): void {
    const payload: JovoDebuggerPayload<JovoStateMutationData> = {
      requestId,
      data,
    };
    this.socket?.emit(JovoDebuggerEvent.AppStateMutation, payload);
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
      apply: (target: Jovo[KEY], thisArg: Jovo, argArray: Parameters<Jovo[KEY]>): unknown => {
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
    args: Parameters<Jovo[KEY]>,
  ): JovoStateMutationData<KEY> | undefined {
    let node: ComponentTreeNode | undefined;
    let handler: string = BuiltInHandler.Start;
    if (key === '$redirect' || key === '$delegate') {
      const componentName = typeof args[0] === 'function' ? args[0].name : args[0];
      node = handleRequest.componentTree.getNodeRelativeTo(
        componentName,
        handleRequest.activeComponentNode?.path,
      );
      handler = args[1] as string;
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

    console.log('\nThis is your webhook url ☁️ ' + underline(blueText(debuggerUrl)));
    // Check if the current output is being piped to somewhere.
    if (process.stdout.isTTY) {
      // Check if we can enable raw mode for input stream to capture raw keystrokes.
      if (process.stdin.setRawMode) {
        setTimeout(() => {
          console.log(`\nTo open Jovo Debugger in your browser, press the "." key.\n`);
        }, 500);

        // Capture unprocessed key input.
        process.stdin.setRawMode(true);
        // Explicitly resume emitting data from the stream.
        process.stdin.resume();
        // Capture readable input as opposed to binary.
        process.stdin.setEncoding('utf-8');

        // Collect input text from input stream.
        let inputText = '';
        process.stdin.on('data', async (keyRaw: Buffer) => {
          const key: string = keyRaw.toString();
          // When dot gets pressed, try to open the debugger in browser.
          if (key === '.') {
            try {
              await open(debuggerUrl);
            } catch (error) {
              console.log(
                `Could not open browser. Please open debugger manually by visiting this url: ${debuggerUrl}`,
              );
            }
            inputText = '';
          } else {
            // When anything else got pressed, record it and send it on enter into the child process.
            if (key.charCodeAt(0) === 13) {
              // Send recorded input to child process. This is useful for restarting a nodemon process with rs, for example.
              process.stdout.write('\n');
              inputText = '';
            } else if (key.charCodeAt(0) === 3) {
              // Ctrl+C has been pressed, kill process.
              if (process.platform === 'win32') {
                process.stdin.pause();
                // @ts-ignore
                process.stdin.setRawMode(false);
                process.exit();
              } else {
                process.exit();
              }
            } else {
              // Record input text and write it into terminal.
              inputText += key;
              process.stdout.write(key);
            }
          }
        });
      } else {
        setTimeout(() => {
          console.log(
            `☁  Could not open browser. Please open debugger manually by visiting this url: ${debuggerUrl}`,
          );
        }, 2500);
      }
    }
  }

  private async onDebuggingAvailable(): Promise<void> {
    if (!this.socket) {
      return this.onSocketNotConnected();
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

  private onResponse(jovo: Jovo): void {
    if (!this.socket) {
      return this.onSocketNotConnected();
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
