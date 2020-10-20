import bent from 'bent';
import { EventEmitter } from 'events';
import _defaults from 'lodash.defaults';
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
  DeviceType,
  RepromptHandler,
  RepromptHandlerConfig,
  RequestType,
  SpeechRecognizer,
  SpeechRecognizerConfig,
  SpeechRecognizerEvent,
  SpeechRecognizerStopListener,
  SpeechSynthesizer,
  SpeechSynthesizerConfig,
  SSMLHandler,
  Store,
  StoreConfig,
  VERSION,
  VoidListener,
  WebRequest,
  WebResponse,
} from './index';

export enum ClientEvent {
  Request = 'request',
  Response = 'response',
  Action = 'action',
  Reprompt = 'reprompt',
  RepromptLimitReached = 'reprompt-limit-reached',
}

export type ClientRequestListener = (request: WebRequest) => void;
export type ClientResponseListener = (response: WebResponse) => void;
export type ClientActionListener = (action: Action) => void;
export type ClientRepromptListener = (repromptActions: Action[]) => void;
export type ClientVoidEvents = ClientEvent.RepromptLimitReached;

export interface Config {
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
  private isCaptureProcessOngoing = false;
  private initialized = false;

  constructor(readonly endpointUrl: string, config?: DeepPartial<Config>) {
    super();

    const defaultConfig = Client.getDefaultConfig();
    this.config = config ? _defaults(config, defaultConfig) : defaultConfig;

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
      this.$audioRecorder.abort();
      this.$speechRecognizer.abort();
      this.$audioPlayer.stop();
      this.$speechSynthesizer.stop();
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

  get isOutputtingAudio(): boolean {
    return this.$audioPlayer.isPlaying || this.$speechSynthesizer.isSpeaking;
  }

  get isCapturingInput(): boolean {
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

  async startInputCapturing(useSpeechRecognizerIfAvailable = true): Promise<void> {
    if (this.isCaptureProcessOngoing) {
      return;
    }
    this.useSpeechRecognition = useSpeechRecognizerIfAvailable;
    if (useSpeechRecognizerIfAvailable && this.$speechRecognizer.isAvailable) {
      this.$speechRecognizer.on(SpeechRecognizerEvent.Stop, this.onSpeechRecognizerStop);
      this.$speechRecognizer.on(SpeechRecognizerEvent.Abort, this.onSpeechRecognizerAbort);
      this.$speechRecognizer.on(SpeechRecognizerEvent.Timeout, this.onSpeechRecognizerAbort);
      this.$speechRecognizer.start();
    } else {
      this.$audioRecorder.on(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
      this.$audioRecorder.on(AudioRecorderEvent.Abort, this.onAudioRecorderAbort);
      this.$audioRecorder.on(AudioRecorderEvent.Timeout, this.onAudioRecorderAbort);
      await this.$audioRecorder.start();
    }
    this.isCaptureProcessOngoing = true;
  }

  stopInputCapturing() {
    if (!this.isCaptureProcessOngoing) {
      return;
    }
    if (this.useSpeechRecognition && this.$speechRecognizer.isAvailable) {
      this.$speechRecognizer.stop();
    } else {
      this.$audioRecorder.stop();
    }
    this.isCaptureProcessOngoing = false;
  }

  abortInputCapturing() {
    if (!this.isCaptureProcessOngoing) {
      return;
    }
    if (this.useSpeechRecognition && this.$speechRecognizer.isAvailable) {
      this.$speechRecognizer.abort();
    } else {
      this.$audioRecorder.abort();
    }
    this.isCaptureProcessOngoing = false;
  }

  // TODO allow direct passing of AudioRecorderResult
  createRequest({ type, body = {} }: ClientInputObject): ClientWebRequest {
    const decorateRequestWithSendMethod = (
      req: WebRequest & { send?: ClientWebRequestSendMethod },
    ) => {
      req.send = async () => {
        this.emit(ClientEvent.Request, req);
        const post = bent<WebResponse>('json', 'POST', 200);
        const res = await post(this.endpointUrl, req);
        if (!res.version || !res.context) {
          throw new Error('Response is not in the correct format.');
        }
        this.emit(ClientEvent.Response, res);
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

  protected async handleResponse(res: WebResponse): Promise<void> {
    if (res.session.end) {
      this.$store.resetSession();
    } else {
      this.$store.sessionData.new = false;
      this.$store.sessionData.data = res.session.data;
    }
    if (res.user) {
      this.$store.userData.data = res.user.data;
    }
    this.$store.save();

    if (res.actions?.length) {
      await this.$actionHandler.handleActions(res.actions);
    }

    if (res.reprompts?.length) {
      await this.$repromptHandler.handleReprompts(res.reprompts, this.useSpeechRecognition);
    }
  }

  private onSpeechRecognizerStop: SpeechRecognizerStopListener = async (event) => {
    if (!event) {
      return;
    }
    const text = AudioHelper.textFromSpeechRecognition(event);
    await this.createRequest({ type: RequestType.TranscribedText, body: { text } }).send();
    this.onSpeechRecognizerAbort();
  };

  private onSpeechRecognizerAbort = () => {
    this.isCaptureProcessOngoing = false;
    this.$speechRecognizer.off(SpeechRecognizerEvent.Stop, this.onSpeechRecognizerStop);
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
    this.isCaptureProcessOngoing = false;
    this.$audioRecorder.off(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
    this.$audioRecorder.off(AudioRecorderEvent.Abort, this.onAudioRecorderAbort);
    this.$audioRecorder.off(AudioRecorderEvent.Timeout, this.onAudioRecorderAbort);
  };
}
