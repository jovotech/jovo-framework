import { Input, PlainObjectType } from '@jovotech/common';
import { NormalizedOutputTemplate } from '@jovotech/output';
import { CoreRequest, CoreResponse, Device } from '@jovotech/platform-core';
import _defaultsDeep from 'lodash.defaultsdeep';
import { v4 as uuidV4 } from 'uuid';
import { AudioRecordingStrategy } from './core/AudioRecordingStrategy';
import { HttpTransportStrategy } from './core/HttpTransportStrategy';
import { NetworkTransportStrategy } from './core/NetworkTransportStrategy';
import { OutputProcessor } from './core/OutputProcessor';
import {
  RecordingModality,
  RecordingModalityType,
  RecordingModalityTypeLike,
  RecordingStrategy,
} from './core/RecordingStrategy';
import {
  AudioPlayer,
  AudioPlayerConfig,
  AudioRecorder,
  AudioRecorderConfig,
  AudioRecorderEvent,
  DeepPartial,
  RepromptHandlerConfig,
  RepromptProcessor,
  SpeechRecognizer,
  SpeechRecognizerConfig,
  SpeechRecognizerEvent,
  SpeechSynthesizer,
  SpeechSynthesizerConfig,
  SSMLProcessor,
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
  Input = 'input',
  Output = 'output',
  RepromptLimitReached = 'reprompt-limit-reached',
}

export interface ClientEventListenerMap extends EventListenerMap {
  [ClientEvent.Request]: (request: ClientRequest) => void;
  [ClientEvent.Response]: (response: ClientResponse) => void;
  [ClientEvent.Input]: (input: Input) => void;
  [ClientEvent.Output]: (output: NormalizedOutputTemplate) => void;
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

export interface InitConfig extends DeepPartial<Config> {
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
        reprompts: RepromptProcessor.getDefaultConfig(),
      },
      store: Store.getDefaultConfig(),
    };
  }

  networkTransportStrategy: NetworkTransportStrategy;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  recordingStrategies: RecordingStrategy<any, any>[];

  currentRecordingModality?: RecordingModality;
  previousRecordingModality?: RecordingModality;

  readonly audioPlayer: AudioPlayer;
  readonly audioRecorder: AudioRecorder;
  readonly outputProcessor: OutputProcessor;
  readonly repromptProcessor: RepromptProcessor;
  readonly ssmlProcessor: SSMLProcessor;
  readonly speechRecognizer: SpeechRecognizer;
  readonly speechSynthesizer: SpeechSynthesizer;
  readonly store: Store;
  readonly config: Config;
  private initialized = false;

  constructor(readonly endpointUrl: string, config?: InitConfig) {
    super();

    this.networkTransportStrategy =
      config?.networkTransportStrategy instanceof HttpTransportStrategy
        ? (config.networkTransportStrategy as HttpTransportStrategy)
        : new HttpTransportStrategy(this.endpointUrl);

    const defaultConfig = Client.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;

    this.recordingStrategies = [new AudioRecordingStrategy(this)];

    this.audioPlayer = new AudioPlayer(this.config.output.audioPlayer);
    this.audioRecorder = new AudioRecorder(this.config.input.audioRecorder);
    this.outputProcessor = new OutputProcessor(this);
    this.repromptProcessor = new RepromptProcessor(this);
    this.ssmlProcessor = new SSMLProcessor(this);
    this.speechRecognizer = new SpeechRecognizer(this.config.input.speechRecognizer);
    this.speechSynthesizer = new SpeechSynthesizer(this.config.output.speechSynthesizer);
    this.store = new Store(this.config.store);
    this.store.load();

    // TODO determine whether the block below should be handled by the library or by the consumer instead (might be bad for use-cases with sockets for example)
    this.on(ClientEvent.Request, () => {
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

    this.on(ClientEvent.Input, async (input) => {
      await this.send(input);
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

  /**
   * Should be called synchronously in a click-handler!
   */
  async initialize(): Promise<void> {
    await this.audioPlayer.initialize();
    await this.audioRecorder.initialize();
    this.initialized = true;
  }

  async startRecording(
    modality: RecordingModality = { type: RecordingModalityType.Audio },
  ): Promise<void> {
    if (this.currentRecordingModality) {
      return;
    }
    const relatedRecordingStrategy = this.getRelatedRecordingStrategy(modality.type);
    this.setRecordingModality(await relatedRecordingStrategy?.startRecording(modality));
  }

  stopRecording(): void {
    if (!this.currentRecordingModality) {
      return;
    }
    const relatedRecordingStrategy = this.getRelatedRecordingStrategy(
      this.currentRecordingModality.type,
    );
    relatedRecordingStrategy?.stopRecording();
  }

  abortRecording(): void {
    if (!this.currentRecordingModality) {
      return;
    }
    const relatedRecordingStrategy = this.getRelatedRecordingStrategy(
      this.currentRecordingModality.type,
    );
    relatedRecordingStrategy?.abortRecording();
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

  async send(inputOrRequest: Input | ClientRequest): Promise<ClientResponse> {
    const request: ClientRequest =
      'version' in inputOrRequest && inputOrRequest.version
        ? inputOrRequest
        : this.createRequest(inputOrRequest as Input);
    this.emit(ClientEvent.Request, request);
    const response = await this.networkTransportStrategy.send(request);
    this.emit(ClientEvent.Response, response);
    await this.handleResponse(response);
    return response;
  }

  setRecordingModality(modality: RecordingModality | undefined): void {
    this.previousRecordingModality = this.currentRecordingModality;
    this.currentRecordingModality = modality;
  }

  protected async handleResponse(response: ClientResponse): Promise<void> {
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

  private getRelatedRecordingStrategy<TYPE extends RecordingModalityTypeLike>(
    type: TYPE,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ): RecordingStrategy<TYPE, any> | undefined {
    return this.recordingStrategies.find((recordingStrategy) => recordingStrategy.type === type);
  }
}
