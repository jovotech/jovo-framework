import { EventEmitter } from 'events';
import _defaultsDeep from 'lodash.defaultsdeep';
import uuidV4 from 'uuid/v4'; //tslint:disable-line
import {
  Action,
  ActionHandler,
  AudioHelper,
  AudioPlayer,
  AudioPlayerConfig,
  AudioRecorder,
  AudioRecorderConfig,
  AudioRecorderEvent,
  AudioRecorderStopListener,
  ClientInputObject,
  ClientWebRequest,
  ClientWebRequestSendMethod,
  DeepPartial,
  Device,
  DeviceType,
  RepromptHandler,
  RepromptHandlerConfig,
  RequestType,
  SpeechRecognizer,
  SpeechRecognizerConfig,
  SpeechRecognizerEndListener,
  SpeechRecognizerEvent,
  SpeechSynthesizer,
  SpeechSynthesizerConfig,
  SSMLHandler,
  Store,
  StoreConfig,
  VoidListener,
  WebRequest,
  WebResponse,
} from './index';

export enum ClientEvent {
  Request = 'request',
  Response = 'response',
  Action = 'action',
  ActionsHandled = 'actions-handled',
  Reprompt = 'reprompt',
  RepromptLimitReached = 'reprompt-limit-reached',
}

export type ClientRequestListener = (request: WebRequest) => void;
export type ClientResponseListener = (response: WebResponse) => void;
export type ClientActionListener = (action: Action) => void;
export type ClientActionsHandledListener = (actions: Action[]) => void;
export type ClientRepromptListener = (repromptActions: Action[]) => void;
export type ClientVoidEvents = ClientEvent.RepromptLimitReached;

export type SupportedVersion = '3.2.0' | '3.2.1' | '3.2.2' | string;

export interface Config {
  version: SupportedVersion;
  appId: string;
  platform: string;
  device: Device;
  locale: string;
  audioPlayer: AudioPlayerConfig;
  audioRecorder: AudioRecorderConfig;
  repromptHandler: RepromptHandlerConfig;
  speechRecognizer: SpeechRecognizerConfig;
  speechSynthesizer: SpeechSynthesizerConfig;
  store: StoreConfig;
}

export class Client extends EventEmitter {
  static getDefaultConfig(): Config {
    return {
      version: '3.2.1',
      appId: '',
      platform: '',
      device: {
        id: '',
        type: DeviceType.Browser,
        capabilities: {
          AUDIO: true,
          HTML: true,
          TEXT: true,
        },
      },
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

  private useSpeechRecognition = true;
  private isInputProcessOngoing = false;
  private initialized = false;

  constructor(readonly endpointUrl: string, config?: DeepPartial<Config>) {
    super();

    const defaultConfig = Client.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;

    this.$audioPlayer = new AudioPlayer(this.config.audioPlayer);
    this.$audioRecorder = new AudioRecorder(this.config.audioRecorder);
    this.$speechRecognizer = new SpeechRecognizer(this.config.speechRecognizer);
    this.$speechSynthesizer = new SpeechSynthesizer(this.config.speechSynthesizer);
    this.$store = new Store(this.config.store);
    this.$store.load();

    this.$actionHandler = new ActionHandler(this);
    this.$repromptHandler = new RepromptHandler(this);
    this.$ssmlHandler = new SSMLHandler(this);

    // TODO determine whether the block below should be handled by the library or by the consumer instead (might be bad for use-cases with sockets for example)
    this.on(ClientEvent.Request, (req) => {
      if (this.$audioRecorder.isRecording) {
        this.$audioRecorder.abort();
      }
      if (this.$speechRecognizer.isRecording) {
        this.$speechRecognizer.abort();
      }
      if (this.$audioPlayer.isPlaying) {
        this.$audioPlayer.stop();
      }
      if (this.$speechSynthesizer.isSpeaking) {
        this.$speechSynthesizer.stop();
      }
    });
    this.$audioRecorder.on(AudioRecorderEvent.Start, () => {
      if (this.$speechRecognizer.isRecording) {
        this.$speechRecognizer.abort();
      }
      if (this.$audioPlayer.isPlaying) {
        this.$audioPlayer.stop();
      }
      if (this.$speechSynthesizer.isSpeaking) {
        this.$speechSynthesizer.stop();
      }
    });

    this.$speechRecognizer.on(SpeechRecognizerEvent.Start, () => {
      if (this.$audioRecorder.isRecording) {
        this.$audioRecorder.abort();
      }
      if (this.$audioPlayer.isPlaying) {
        this.$audioPlayer.stop();
      }
      if (this.$speechSynthesizer.isSpeaking) {
        this.$speechSynthesizer.stop();
      }
    });

    this.on(ClientEvent.Response, (res) => {
      return this.handleResponse(res);
    });

    this.on(ClientEvent.RepromptLimitReached, () => {
      this.$store.resetSession();
      this.$store.save();
    });
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  get isPlayingAudio(): boolean {
    return this.$audioPlayer.isPlaying || this.$speechSynthesizer.isSpeaking;
  }

  get isRecordingInput(): boolean {
    return this.$audioRecorder.isRecording || this.$speechRecognizer.isRecording;
  }

  get isUsingSpeechRecognition(): boolean {
    return this.useSpeechRecognition;
  }

  addListener(event: ClientEvent.Request, listener: ClientRequestListener): this;
  addListener(event: ClientEvent.Response, listener: ClientResponseListener): this;
  addListener(event: ClientEvent.Action, listener: ClientActionListener): this;
  addListener(event: ClientEvent.Reprompt, listener: ClientRepromptListener): this;
  addListener(event: ClientVoidEvents, listener: VoidListener): this;
  addListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.addListener(event, listener);
  }

  on(event: ClientEvent.Request, listener: ClientRequestListener): this;
  on(event: ClientEvent.Response, listener: ClientResponseListener): this;
  on(event: ClientEvent.Action, listener: ClientActionListener): this;
  on(event: ClientEvent.Reprompt, listener: ClientRepromptListener): this;
  on(event: ClientVoidEvents, listener: VoidListener): this;
  on(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.on(event, listener);
  }

  once(event: ClientEvent.Request, listener: ClientRequestListener): this;
  once(event: ClientEvent.Response, listener: ClientResponseListener): this;
  once(event: ClientEvent.Action, listener: ClientActionListener): this;
  once(event: ClientEvent.Reprompt, listener: ClientRepromptListener): this;
  once(event: ClientVoidEvents, listener: VoidListener): this;
  once(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.once(event, listener);
  }

  prependListener(event: ClientEvent.Request, listener: ClientRequestListener): this;
  prependListener(event: ClientEvent.Response, listener: ClientResponseListener): this;
  prependListener(event: ClientEvent.Action, listener: ClientActionListener): this;
  prependListener(event: ClientEvent.Reprompt, listener: ClientRepromptListener): this;
  prependListener(event: ClientVoidEvents, listener: VoidListener): this;
  prependListener(event: string | symbol, listener: (...args: any[]) => void): this {
    return super.prependListener(event, listener);
  }

  prependOnceListener(event: ClientEvent.Request, listener: ClientRequestListener): this;
  prependOnceListener(event: ClientEvent.Response, listener: ClientResponseListener): this;
  prependOnceListener(event: ClientEvent.Action, listener: ClientActionListener): this;
  prependOnceListener(event: ClientEvent.Reprompt, listener: ClientRepromptListener): this;
  prependOnceListener(event: ClientVoidEvents, listener: VoidListener): this;
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

  async startInputRecording(useSpeechRecognizerIfAvailable = true): Promise<void> {
    if (this.isInputProcessOngoing) {
      return;
    }
    this.useSpeechRecognition = useSpeechRecognizerIfAvailable;
    if (useSpeechRecognizerIfAvailable && this.$speechRecognizer.isAvailable) {
      this.$speechRecognizer.on(SpeechRecognizerEvent.End, this.onSpeechRecognizerEnd);
      this.$speechRecognizer.on(SpeechRecognizerEvent.Abort, this.onSpeechRecognizerAbort);
      this.$speechRecognizer.on(SpeechRecognizerEvent.Timeout, this.onSpeechRecognizerAbort);
      this.$speechRecognizer.start();
    } else {
      this.$audioRecorder.on(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
      this.$audioRecorder.on(AudioRecorderEvent.Abort, this.onAudioRecorderAbort);
      this.$audioRecorder.on(AudioRecorderEvent.Timeout, this.onAudioRecorderAbort);
      await this.$audioRecorder.start();
    }
    this.isInputProcessOngoing = true;
  }

  stopInputRecording() {
    if (!this.isInputProcessOngoing) {
      return;
    }
    if (this.useSpeechRecognition && this.$speechRecognizer.isAvailable) {
      this.$speechRecognizer.stop();
    } else {
      this.$audioRecorder.stop();
    }
    this.isInputProcessOngoing = false;
  }

  abortInputRecording() {
    if (!this.isInputProcessOngoing) {
      return;
    }
    if (this.useSpeechRecognition && this.$speechRecognizer.isAvailable) {
      this.$speechRecognizer.abort();
    } else {
      this.$audioRecorder.abort();
    }
    this.isInputProcessOngoing = false;
  }

  // TODO allow direct passing of AudioRecorderResult
  createRequest({ type, body = {} }: ClientInputObject): ClientWebRequest {
    const req: WebRequest & { send?: ClientWebRequestSendMethod } = {
      version: this.config.version,
      type: 'jovo-platform-web',
      request: {
        id: uuidV4(),
        timestamp: new Date().toISOString(),
        type,
        body,
        locale: this.config.locale,
        data: {},
      },
      context: {
        appId: this.config.appId,
        platform: this.config.platform,
        device: this.config.device,
        session: this.$store.sessionData,
        user: this.$store.userData,
      },
    };
    req.send = async (config?: RequestInit) => {
      this.emit(ClientEvent.Request, req);
      config = _defaultsDeep(config || {}, {
        method: 'POST',
        // skip all empty values
        body: JSON.stringify(req, (key: string, value: any) => {
          if (value) {
            return value;
          }
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const response = await fetch(this.endpointUrl, config);
      const data = await response.json();
      if (!data.version || !data.context) {
        throw {
          message: 'Response is not in the correct format.',
          name: 'InvalidResponseError',
          data,
        };
      }
      this.emit(ClientEvent.Response, data);
      return data;
    };

    return req as ClientWebRequest;
  }

  protected async handleResponse(res: WebResponse): Promise<void> {
    if (res.session.end) {
      this.$store.resetSession();
    } else {
      this.$store.sessionData.new = false;
      this.$store.sessionData.data = res.session.data;
    }
    if (res.user?.data) {
      this.$store.userData.data = res.user.data;
    }
    this.$store.save();

    if (res.actions?.length) {
      await this.$actionHandler.handleActions(res.actions);
      this.emit(ClientEvent.ActionsHandled, res.actions);
    }

    if (res.reprompts?.length) {
      await this.$repromptHandler.handleReprompts(res.reprompts, this.useSpeechRecognition);
    }
  }

  private onSpeechRecognizerEnd: SpeechRecognizerEndListener = async (event) => {
    if (!event) {
      this.onSpeechRecognizerAbort();
      return;
    }
    const text = AudioHelper.textFromSpeechRecognition(event);
    await this.createRequest({ type: RequestType.TranscribedText, body: { text } }).send();
    this.onSpeechRecognizerAbort();
  };

  private onSpeechRecognizerAbort = () => {
    this.isInputProcessOngoing = false;
    this.$speechRecognizer.off(SpeechRecognizerEvent.End, this.onSpeechRecognizerEnd);
    this.$speechRecognizer.off(SpeechRecognizerEvent.Abort, this.onSpeechRecognizerAbort);
    this.$speechRecognizer.off(SpeechRecognizerEvent.Timeout, this.onSpeechRecognizerAbort);
  };

  private onAudioRecorderStop: AudioRecorderStopListener = async (result) => {
    await this.createRequest({
      type: RequestType.Audio,
      body: AudioHelper.getRequestBodyFromAudioRecorderResult(result),
    }).send();
    this.onAudioRecorderAbort();
  };

  private onAudioRecorderAbort = () => {
    this.isInputProcessOngoing = false;
    this.$audioRecorder.off(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
    this.$audioRecorder.off(AudioRecorderEvent.Abort, this.onAudioRecorderAbort);
    this.$audioRecorder.off(AudioRecorderEvent.Timeout, this.onAudioRecorderAbort);
  };
}
