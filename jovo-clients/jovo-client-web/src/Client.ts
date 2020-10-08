import axios, { AxiosRequestConfig } from 'axios';
import { EventEmitter } from 'events';
import _defaults from 'lodash.defaults';
import { v4 as uuidV4 } from 'uuid';
import { DeviceType, RequestBody, RequestType, VERSION, WebRequest, WebResponse } from './index';
import { ActionHandler } from './new-core/ActionHandler';
import { RepromptHandler, RepromptHandlerConfig } from './new-core/RepromptHandler';
import { SSMLHandler } from './new-core/SSMLHandler';
import { AudioPlayer, AudioPlayerConfig } from './standalone/AudioPlayer';
import { AudioRecorder, AudioRecorderConfig } from './standalone/AudioRecorder';
import { SpeechRecognizer, SpeechRecognizerConfig } from './standalone/SpeechRecognizer';
import { SpeechSynthesizer, SpeechSynthesizerConfig } from './standalone/SpeechSynthesizer';
import { Store, StoreConfig } from './standalone/Store';
import {
  ClientInputObject,
  ClientWebRequest,
  ClientWebRequestSendMethod,
  DeepPartial,
} from './types';

export enum ClientEvent {
  Request = 'request',
  Response = 'response',
}

export type ClientRequestListener = (request: WebRequest) => void;
export type ClientResponseListener = (response: WebResponse) => void;

export interface Config {
  locale: string;
  audioPlayer: AudioPlayerConfig;
  audioRecorder: AudioRecorderConfig;
  repromptHandler: RepromptHandlerConfig;
  speechRecognizer: SpeechRecognizerConfig;
  speechSynthesizer: SpeechSynthesizerConfig;
  store: StoreConfig;
}

// TODO rename soon
export class Client extends EventEmitter {
  static getDefaultConfig(): Config {
    return {
      locale: 'en',
      audioPlayer: AudioPlayer.getDefaultConfig(),
      audioRecorder: AudioRecorder.getDefaultConfig(),
      repromptHandler: RepromptHandler.getDefaultConfig(),
      speechRecognizer: SpeechRecognizer.getDefaultConfig(),
      speechSynthesizer: SpeechSynthesizer.getDefaultConfig(),
      store: Store.getDefaultConfig(),
    };
  }

  readonly $audioPlayer: AudioPlayer;
  readonly $audioRecorder: AudioRecorder;
  readonly $speechRecognizer: SpeechRecognizer;
  readonly $speechSynthesizer: SpeechSynthesizer;
  readonly $store: Store;

  readonly config: Config;

  readonly $actionHandler: ActionHandler;
  readonly $repromptHandler: RepromptHandler;
  readonly $ssmlHandler: SSMLHandler;

  private initialized = false;

  constructor(readonly endpointUrl: string, config?: DeepPartial<Config>) {
    super();

    const defaultConfig = Client.getDefaultConfig();
    this.config = config ? _defaults(config, defaultConfig) : defaultConfig;

    this.$audioPlayer = new AudioPlayer();
    this.$audioRecorder = new AudioRecorder(this.config.audioRecorder);
    this.$speechRecognizer = new SpeechRecognizer(this.config.speechRecognizer);
    this.$speechSynthesizer = new SpeechSynthesizer(this.config.speechSynthesizer);
    this.$store = new Store(this.config.store);
    this.$store.load();

    this.$actionHandler = new ActionHandler(this);
    this.$repromptHandler = new RepromptHandler(this);
    this.$ssmlHandler = new SSMLHandler(this);

    this.on(ClientEvent.Response, (res) => {
      return this.handleResponse(res);
    });
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  addListener(event: ClientEvent.Request, listener: ClientRequestListener): this;
  addListener(event: ClientEvent.Response, listener: ClientResponseListener): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  on(event: ClientEvent.Request, listener: ClientRequestListener): this;
  on(event: ClientEvent.Response, listener: ClientResponseListener): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: ClientEvent.Request, listener: ClientRequestListener): this;
  once(event: ClientEvent.Response, listener: ClientResponseListener): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: ClientEvent.Request, listener: ClientRequestListener): this;
  prependListener(event: ClientEvent.Response, listener: ClientResponseListener): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: ClientEvent.Request, listener: ClientRequestListener): this;
  prependOnceListener(event: ClientEvent.Response, listener: ClientResponseListener): this;
  prependOnceListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependOnceListener(event, listener);
  }

  /**
   * Should be called synchronously in a click-handler!
   */
  async initialize(): Promise<void> {
    await this.$audioPlayer.initialize();
    await this.$audioRecorder.initialize();
    this.initialized = true;
  }

  input({ type, body = {} }: ClientInputObject): ClientWebRequest {
    const decorateRequestWithSendMethod = (
      req: WebRequest & { send?: ClientWebRequestSendMethod },
    ) => {
      // TODO maybe give the option to pass a send method to make it easy to allow sending to websockets for example
      req.send = async (config: AxiosRequestConfig = {}) => {
        config = _defaults(config, {
          method: 'POST',
          url: this.endpointUrl,
          data: req,
        });
        this.emit(ClientEvent.Request, req);
        const res = await axios.request<WebResponse>(config);
        this.emit(ClientEvent.Response, res?.data);
        return res;
      };
      return req as ClientWebRequest;
    };
    return decorateRequestWithSendMethod({
      version: VERSION,
      type: 'jovo-platform-web',
      request: {
        id: uuidV4(),
        timestamp: new Date().toISOString(),
        type,
        body,
        locale: '',
        nlu: {},
        data: {},
      },
      context: {
        appId: '',
        platform: 'CANNOT_BE_EMPTY',
        device: {
          id: '',
          type: DeviceType.Browser,
          capabilities: {
            AUDIO: '',
            HTML: '',
            TEXT: '',
          },
        },
        session: this.$store.sessionData,
        user: this.$store.userData,
      },
    });
  }

  // TODO determine whether there is a better solution
  protected async handleResponse(res: WebResponse): Promise<void> {
    // TODO fully implement
    await this.$actionHandler.handleActions(res.actions);

    if (res.reprompts?.length) {
      await this.$repromptHandler.handleReprompts(res.reprompts);
    }
  }
}
