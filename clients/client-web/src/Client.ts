import { Input, InputType, PlainObjectType } from '@jovotech/common';
import { CoreRequest, CoreResponse, Device } from '@jovotech/platform-core';
import _defaultsDeep from 'lodash.defaultsdeep';
import { v4 as uuidV4 } from 'uuid';
import { HttpTransportStrategy } from './core/HttpTransportStrategy';
import { NetworkTransportStrategy } from './core/NetworkTransportStrategy';
import { OutputProcessor } from './core/OutputProcessor';
import {
  AudioHelper,
  AudioPlayer,
  AudioPlayerConfig,
  AudioRecorder,
  AudioRecorderConfig,
  AudioRecorderEvent,
  AudioRecorderEventListenerMap,
  Base64Converter,
  DeepPartial,
  RepromptHandler,
  RepromptHandlerConfig,
  SpeechRecognizer,
  SpeechRecognizerConfig,
  SpeechRecognizerEvent,
  SpeechRecognizerEventListenerMap,
  SpeechSynthesizer,
  SpeechSynthesizerConfig,
  Store,
  StoreConfig,
  VoidListener,
} from './index';
import { EventListenerMap, TypedEventEmitter } from './utilities/TypedEventEmitter';

export type ClientRequest = PlainObjectType<CoreRequest>;
export type ClientResponse = PlainObjectType<CoreResponse>;

export enum ClientEvent {
  Request = 'request',
  Response = 'response',
  RepromptLimitReached = 'reprompt-limit-reached',
}

export interface ClientEventListenerMap extends EventListenerMap {
  [ClientEvent.Request]: (request: ClientRequest) => void;
  [ClientEvent.Response]: (response: ClientResponse) => void;
  [ClientEvent.RepromptLimitReached]: VoidListener;
}

export interface InputConfig {
  audioRecorder: AudioRecorderConfig;
  speechRecognizer: SpeechRecognizerConfig;
}

export interface OutputConfig {
  audioPlayer: AudioPlayerConfig;
  speechSynthesizer: SpeechSynthesizerConfig;
  reprompts: RepromptHandlerConfig;
}

export interface Config {
  version: string;
  locale: string;
  platform: string;
  device: Device;
  input: InputConfig;
  output: OutputConfig;
  store: StoreConfig;
}

export interface InitConfig extends Config {
  networkTransportStrategy?: NetworkTransportStrategy;
}

export class Client extends TypedEventEmitter<ClientEventListenerMap> {
  static getDefaultConfig(): Config {
    return {
      version: '4.0-beta',
      locale: 'en',
      platform: 'web',
      device: {
        id: uuidV4(),
        capabilities: ['SCREEN', 'AUDIO'],
      },
      input: {
        audioRecorder: AudioRecorder.getDefaultConfig(),
        speechRecognizer: SpeechRecognizer.getDefaultConfig(),
      },
      output: {
        audioPlayer: AudioPlayer.getDefaultConfig(),
        speechSynthesizer: SpeechSynthesizer.getDefaultConfig(),
        reprompts: RepromptHandler.getDefaultConfig(),
      },
      store: Store.getDefaultConfig(),
    };
  }

  networkTransportStrategy: NetworkTransportStrategy;

  readonly audioPlayer: AudioPlayer;
  readonly audioRecorder: AudioRecorder;
  readonly outputProcessor: OutputProcessor;
  readonly speechRecognizer: SpeechRecognizer;
  readonly speechSynthesizer: SpeechSynthesizer;
  readonly store: Store;
  readonly config: Config;
  private useSpeechRecognition = true;
  private isInputProcessOngoing = false;
  private initialized = false;

  constructor(readonly endpointUrl: string, config?: DeepPartial<InitConfig>) {
    super();

    this.networkTransportStrategy =
      config?.networkTransportStrategy instanceof HttpTransportStrategy
        ? (config.networkTransportStrategy as HttpTransportStrategy)
        : new HttpTransportStrategy(this.endpointUrl);

    const defaultConfig = Client.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;

    this.audioPlayer = new AudioPlayer(this.config.output.audioPlayer);
    this.audioRecorder = new AudioRecorder(this.config.input.audioRecorder);
    this.outputProcessor = new OutputProcessor(this);
    this.speechRecognizer = new SpeechRecognizer(this.config.input.speechRecognizer);
    this.speechSynthesizer = new SpeechSynthesizer(this.config.output.speechSynthesizer);
    this.store = new Store(this.config.store);
    this.store.load();

    // TODO determine whether the block below should be handled by the library or by the consumer instead (might be bad for use-cases with sockets for example)
    this.on(ClientEvent.Request, (req) => {
      if (this.audioRecorder.isRecording) {
        this.audioRecorder.abort();
      }
      if (this.speechRecognizer.isRecording) {
        this.speechRecognizer.abort();
      }
      if (this.audioPlayer.isPlaying) {
        this.audioPlayer.stop();
      }
      if (this.speechSynthesizer.isSpeaking) {
        this.speechSynthesizer.stop();
      }
    });
    this.audioRecorder.on(AudioRecorderEvent.Start, () => {
      if (this.speechRecognizer.isRecording) {
        this.speechRecognizer.abort();
      }
      if (this.audioPlayer.isPlaying) {
        this.audioPlayer.stop();
      }
      if (this.speechSynthesizer.isSpeaking) {
        this.speechSynthesizer.stop();
      }
    });

    this.speechRecognizer.on(SpeechRecognizerEvent.Start, () => {
      if (this.audioRecorder.isRecording) {
        this.audioRecorder.abort();
      }
      if (this.audioPlayer.isPlaying) {
        this.audioPlayer.stop();
      }
      if (this.speechSynthesizer.isSpeaking) {
        this.speechSynthesizer.stop();
      }
    });

    this.on(ClientEvent.RepromptLimitReached, () => {
      this.store.resetSession();
      this.store.save();
    });
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  get isPlayingAudio(): boolean {
    return this.audioPlayer.isPlaying || this.speechSynthesizer.isSpeaking;
  }

  get isRecordingInput(): boolean {
    return this.audioRecorder.isRecording || this.speechRecognizer.isRecording;
  }

  get isUsingSpeechRecognition(): boolean {
    return this.useSpeechRecognition;
  }

  /**
   * Should be called synchronously in a click-handler!
   */
  async initialize(): Promise<void> {
    await this.audioPlayer.initialize();
    await this.audioRecorder.initialize();
    this.initialized = true;
  }

  async startInputRecording(useSpeechRecognizerIfAvailable = true): Promise<void> {
    if (this.isInputProcessOngoing) {
      return;
    }
    this.useSpeechRecognition = useSpeechRecognizerIfAvailable;
    if (useSpeechRecognizerIfAvailable && this.speechRecognizer.isAvailable) {
      this.speechRecognizer.on(SpeechRecognizerEvent.End, this.onSpeechRecognizerEnd);
      this.speechRecognizer.on(SpeechRecognizerEvent.Abort, this.onSpeechRecognizerAbort);
      this.speechRecognizer.on(SpeechRecognizerEvent.Timeout, this.onSpeechRecognizerAbort);
      this.speechRecognizer.start();
    } else {
      this.audioRecorder.on(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
      this.audioRecorder.on(AudioRecorderEvent.Abort, this.onAudioRecorderAbort);
      this.audioRecorder.on(AudioRecorderEvent.Timeout, this.onAudioRecorderAbort);
      await this.audioRecorder.start();
    }
    this.isInputProcessOngoing = true;
  }

  stopInputRecording(): void {
    if (!this.isInputProcessOngoing) {
      return;
    }
    if (this.useSpeechRecognition && this.speechRecognizer.isAvailable) {
      this.speechRecognizer.stop();
    } else {
      this.audioRecorder.stop();
    }
    this.isInputProcessOngoing = false;
  }

  abortInputRecording(): void {
    if (!this.isInputProcessOngoing) {
      return;
    }
    if (this.useSpeechRecognition && this.speechRecognizer.isAvailable) {
      this.speechRecognizer.abort();
    } else {
      this.audioRecorder.abort();
    }
    this.isInputProcessOngoing = false;
  }

  createRequest(input: Input): ClientRequest {
    return {
      version: this.config.version,
      platform: this.config.platform,
      id: uuidV4(),
      timestamp: new Date().toISOString(),
      timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      locale: this.config.locale,
      input,
      context: {
        device: this.config.device,
        session: this.store.sessionData,
        user: this.store.userData,
      },
    };
  }

  async send(input: Input): Promise<ClientResponse> {
    const request = this.createRequest(input);
    const response = await this.networkTransportStrategy.send(request);
    this.emit(ClientEvent.Response, response);
    await this.handleResponse(response);
    return response;
  }

  protected async handleResponse(response: ClientResponse): Promise<void> {
    // TODO update to latest version
    if (response.context.session.end) {
      this.store.resetSession();
    } else {
      this.store.sessionData.isNew = false;
      this.store.sessionData.state = response.context.session.state;
      this.store.sessionData.data = response.context.session.data;
      this.store.sessionData.updatedAt = new Date();
    }
    if (response.context.user?.data) {
      this.store.userData.data = response.context.user.data;
    }
    this.store.save();

    if (response.output?.length) {
      await this.outputProcessor.processSequence(response.output);
    }
  }

  private onSpeechRecognizerEnd: SpeechRecognizerEventListenerMap['end'] = async (event) => {
    if (!event) {
      this.onSpeechRecognizerAbort();
      return;
    }
    const text = AudioHelper.textFromSpeechRecognition(event);
    await this.send({
      type: InputType.TranscribedSpeech,
      text,
    });
    this.onSpeechRecognizerAbort();
  };

  private onSpeechRecognizerAbort = () => {
    this.isInputProcessOngoing = false;
    this.speechRecognizer.off(SpeechRecognizerEvent.End, this.onSpeechRecognizerEnd);
    this.speechRecognizer.off(SpeechRecognizerEvent.Abort, this.onSpeechRecognizerAbort);
    this.speechRecognizer.off(SpeechRecognizerEvent.Timeout, this.onSpeechRecognizerAbort);
  };

  private onAudioRecorderStop: AudioRecorderEventListenerMap['stop'] = async (result) => {
    await this.send({
      type: InputType.Speech,
      audio: {
        sampleRate: result.sampleRate,
        base64: Base64Converter.arrayBufferToBase64(result.data.buffer),
      },
    });
    this.onAudioRecorderAbort();
  };

  private onAudioRecorderAbort = () => {
    this.isInputProcessOngoing = false;
    this.audioRecorder.off(AudioRecorderEvent.Stop, this.onAudioRecorderStop);
    this.audioRecorder.off(AudioRecorderEvent.Abort, this.onAudioRecorderAbort);
    this.audioRecorder.off(AudioRecorderEvent.Timeout, this.onAudioRecorderAbort);
  };
}
