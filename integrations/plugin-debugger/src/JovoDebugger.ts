import {
  App,
  DeepPartial,
  Extensible,
  HandleRequest,
  InvalidParentError,
  Jovo,
  Plugin,
  PluginConfig,
  SessionData,
} from '@jovotech/core';
import { promises } from 'fs';
import { join } from 'path';
import { connect, Socket } from 'socket.io-client';
import { Writable } from 'stream';

// TODO: implement config
export interface JovoDebuggerConfig extends PluginConfig {
  webhookUrl: string;
  languageModelEnabled: boolean;
  languageModelPath: string;
  debuggerJsonPath: string;
}

export enum JovoDebuggerEvent {
  DebuggingAvailable = 'debugging.available',
  DebuggingUnavailable = 'debugging.unavailable',

  DebuggerRequest = 'debugger.request',
  DebuggerLanguageModelRequest = 'debugger.language-model-request',

  AppLanguageModelResponse = 'app.language-model-response',
  AppDebuggerConfigResponse = 'app.debugger-config-response',
  AppConsoleLog = 'app.console-log',
  AppRequest = 'app.request',
  AppResponse = 'app.response',

  AppJovoUpdate = 'app.jovo-update',
}

// TODO: check if type can be improved, same for Response
// problem with that is,that older versions still have this format
// to tackle that the data can be transformed in the frontend/backend
/* eslint-disable @typescript-eslint/no-explicit-any */
export interface JovoDebuggerRequest {
  json: any;
  platformType: string;
  requestSessionAttributes: SessionData;
  userId: string;
  route?: any;
  inputs?: any;
  rawText?: string;
  database?: any;
  error?: any;
}

export interface JovoDebuggerResponse {
  json: any;
  database?: any;
  speech?: string;
  platformType: string;
  userId: string;
  route: any;
  sessionEnded: boolean;
  inputs: any;
  requestSessionAttributes: any;
  responseSessionAttributes: any;
  audioplayer?: any;
}

/* eslint-enable @typescript-eslint/no-explicit-any */

const WEBHOOK_ARGUMENT_OPTIONS = ['--intent', '--launch', '--file', '--template'];

export class JovoDebugger extends Plugin<JovoDebuggerConfig> {
  socket?: typeof Socket;

  hasOverriddenWrite = false;

  constructor(config?: DeepPartial<JovoDebuggerConfig>) {
    super(config);

    const jovoWebhookEnabled =
      process.argv.includes('--jovo-webhook') && !process.argv.includes('--disable-jovo-debugger');
    const webhookEnabled =
      process.argv.includes('--webhook') &&
      WEBHOOK_ARGUMENT_OPTIONS.some((argOption) => process.argv.includes(argOption));
    if (webhookEnabled || jovoWebhookEnabled) {
      this.config.enabled = true;
    }
  }

  // TODO check default config
  getDefaultConfig(): JovoDebuggerConfig {
    return {
      webhookUrl: 'https://webhook.jovo.cloud',
      enabled: false,
      languageModelEnabled: true,
      languageModelPath: './../models',
      debuggerJsonPath: './../debugger.json',
    };
  }

  install(parent: Extensible) {
    if (!(parent instanceof App)) {
      // TODO: implement error
      throw new InvalidParentError();
    }
  }

  async initialize(app: App): Promise<void> {
    // TODO make request if launch options passed
    if (this.config.enabled === false) return;

    await this.connectToWebhook();
    if (!this.socket) {
      // TODO: implement error
      throw new Error();
    }

    this.socket.on(JovoDebuggerEvent.DebuggingAvailable, this.onDebuggingAvailable);
    this.socket.on(
      JovoDebuggerEvent.DebuggerLanguageModelRequest,
      this.onDebuggerLanguageModelRequest,
    );
    this.socket.on(JovoDebuggerEvent.DebuggerRequest, this.onDebuggerRequest);

    app.middlewareCollection.use('after.dialog.logic', this.onRequest);
    app.middlewareCollection.use('after.response', this.onResponse);

    this.patchJovoProxyWrap(app);
  }

  private patchJovoProxyWrap(app: App) {
    app.platforms.forEach((platform) => {
      const createJovoFn = platform.createJovoInstance;
      platform.createJovoInstance = (appArg, handleRequestArg) => {
        const jovo = createJovoFn.call(platform, appArg, handleRequestArg);
        return new Proxy(jovo, this.getProxyHandler());
      };
    });
  }

  private getProxyHandler<T extends Record<string, any>>(path = ''): ProxyHandler<T> {
    return {
      get: (target, key: string) => {
        if (typeof target[key] === 'object' && target[key] !== null) {
          return new Proxy(target[key], this.getProxyHandler(path ? [path, key].join('.') : key));
        } else {
          return target[key];
        }
      },
      set: (target, key: string, value: unknown): boolean => {
        (target as Record<string, unknown>)[key] = value;
        this.socket?.emit(JovoDebuggerEvent.AppJovoUpdate, {
          key,
          value,
          path: path ? [path, key].join('.') : key,
        });
        return true;
      },
    };
  }

  private onDebuggingAvailable = () => {
    if (!this.socket) {
      // TODO: implement error
      throw new Error();
    }

    // TODO: check if there is a better way and this is desired
    function propagateStreamAsLog(stream: Writable, socket: typeof Socket) {
      const originalWriteFn = stream.write;
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
  };

  private onDebuggerLanguageModelRequest = async () => {
    if (!this.config.languageModelEnabled) return;
    if (!this.config.languageModelPath || !this.config.debuggerJsonPath) {
      // TODO: implement error
      throw new Error();
    }
    if (!this.socket) {
      // TODO: implement error
      throw new Error();
    }
    // look for language-models
    // TODO: implement building language-model-obj
    const languageModel: any = {};

    this.socket.emit(JovoDebuggerEvent.AppLanguageModelResponse);

    // TODO implement sending debuggerConfig
  };

  private onDebuggerRequest = (request: any) => {
    const userId: string = request.userId || 'jovo-debugger-user';
    // TODO: implement building request with RequestBuilder and TestSuite
  };

  private onRequest = (handleRequest: HandleRequest, jovo: Jovo) => {
    if (!this.socket) {
      // TODO: implement error
      throw new Error();
    }
    // TODO: complete filling request from data in jovo and check platformType
    const request: JovoDebuggerRequest = {
      inputs: jovo.$entities,
      json: jovo.$request,
      platformType: jovo.constructor.name,
      requestSessionAttributes: {},
      route: jovo.$route,
      userId: '',
    };

    this.socket.emit(JovoDebuggerEvent.AppRequest, request);
  };

  private onResponse = (handleRequest: HandleRequest, jovo: Jovo) => {
    if (!this.socket) {
      // TODO: implement error
      throw new Error();
    }
    // TODO: fill response from data in jovo and check platformType
    const response: JovoDebuggerResponse = {
      inputs: jovo.$entities,
      json: jovo.$response,
      platformType: jovo.constructor.name,
      requestSessionAttributes: {},
      responseSessionAttributes: jovo.$session.$data,
      route: jovo.$route,
      sessionEnded: false,
      speech: '',
      userId: '',
    };

    this.socket.emit(JovoDebuggerEvent.AppResponse, response);
  };

  private async connectToWebhook() {
    // const webhookId = await this.retrieveLocalWebhookId();
    // this.socket = connect(this.config.webhookUrl, {
    //   query: {
    //     id: webhookId,
    //     type: 'app',
    //   },
    // });
    this.socket = connect('http://localhost:8443', {
      query: {
        id: 'test',
        type: 'app',
      },
    });
    this.socket.on('connect_error', (error: Error) => {
      // TODO: handle error
    });
  }

  private async retrieveLocalWebhookId(): Promise<string> {
    try {
      const homeConfigPath = join(this.getUserHomePath(), '.jovo/config');
      const homeConfigBuffer = await promises.readFile(homeConfigPath);
      const homeConfigData = JSON.parse(homeConfigBuffer.toString());
      if (homeConfigData?.webhook?.uuid) {
        return homeConfigData.webhook.uuid;
      }
      // TODO implement error
      throw new Error();
    } catch (e) {
      // TODO implement error
      throw new Error();
    }
  }

  private getUserHomePath(): string {
    const path = process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
    if (!path) {
      // TODO implement error
      throw new Error();
    }
    return path;
  }
}
