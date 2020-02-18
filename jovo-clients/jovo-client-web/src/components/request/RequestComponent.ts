import uuid = require('uuid');
import {
  AssistantEvents,
  AudioRecordedPayload,
  Base64Converter,
  Component,
  ComponentConfig,
  CoreRequest,
  DeviceType,
  InputEvents,
  InputRecordEvents,
  NetworkHandler,
  NetworkResponse,
  RequestEvents,
  RequestType,
  VERSION,
} from '../..';

import { AjaxAdapter } from './adapters/AjaxAdapter';

declare module '../../core/Interfaces' {
  interface Config {
    RequestComponent: RequestComponentConfig;
  }
}

export interface RequestComponentConfig extends ComponentConfig {}

export class RequestComponent extends Component<RequestComponentConfig> {
  static DEFAULT_CONFIG: RequestComponentConfig = {};

  readonly name = 'RequestComponent';

  private $networkHandler!: NetworkHandler;

  get url(): string {
    return this.$client.url;
  }

  get isPushToTalkUsed(): boolean {
    return this.$client.$config.InputComponent.mode === 'push-to-talk';
  }

  get locale(): string {
    return this.$client.$config.locale;
  }

  get shouldLaunchFirst(): boolean {
    return this.$client.$config.launchFirst;
  }

  async onInit(): Promise<void> {
    const adapter = new AjaxAdapter(this.$client);
    this.$networkHandler = new NetworkHandler(adapter);
    this.$client.prependListener(AssistantEvents.LaunchRequest, this.onFirstRequest.bind(this));
    this.$client.on(InputEvents.Text, this.onSendText.bind(this));
    this.$client.on(InputRecordEvents.Recorded, this.onAudioRecorded.bind(this));
    this.$client.on(InputRecordEvents.SpeechRecognized, this.onSpeechRecognized.bind(this));
  }

  getDefaultConfig(): RequestComponentConfig {
    return {};
  }

  private async onFirstRequest() {
    if (!this.$client.hasSentLaunchRequest && this.shouldLaunchFirst) {
      return this.send(RequestType.Launch);
    }
  }

  private async onAudioRecorded(payload: AudioRecordedPayload) {
    if (payload.forward) {
      const base64EncodedAudio = await Base64Converter.arrayBufferToBase64(payload.data.buffer);

      return this.send(RequestType.Audio, {
        audio: {
          sampleRate: payload.sampleRate,
          b64string: base64EncodedAudio,
        },
      });
    }
  }

  private async onSpeechRecognized(event: SpeechRecognitionEvent) {
    if (!this.isPushToTalkUsed && event.results[0].isFinal) {
      return this.send(RequestType.TranscribedText, {
        text: event.results[0][0].transcript,
      });
    }
  }

  private async onSendText(text: string) {
    return this.send(RequestType.Text, {
      text,
    });
  }

  private async handleSendRequest(data: CoreRequest) {
    try {
      const res = await this.sendRequest(data);
      this.$client.emit(RequestEvents.Result, res);
      if (res.status && res.status === 200 && res.data && res.data.version) {
        this.$client.emit(RequestEvents.Success, res.data);
      } else {
        this.$client.emit(RequestEvents.Error, new Error('No valid response was received.'));
      }
      return;
    } catch (e) {
      this.$client.emit(RequestEvents.Error, e);
    }
  }

  // tslint:disable-next-line:no-any
  private send(type: RequestType, body: Record<string, any> = {}) {
    // TODO fill missing data like appId and platform
    const requestData: CoreRequest = {
      version: VERSION,
      request: {
        id: uuid.v4(),
        timestamp: new Date().toISOString(),
        type,
        body,
        locale: this.locale,
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
        session: this.$client.store.session,
        user: this.$client.store.user,
      },
    };

    if (this.$client.$config.debugMode) {
      // tslint:disable-next-line:no-console
      console.log('[REQ]', requestData);
    }
    this.$client.emit(RequestEvents.Data, requestData);

    return this.handleSendRequest(requestData);
  }

  private sendRequest(data: CoreRequest): Promise<NetworkResponse> {
    const jsonData = JSON.stringify(data);
    return this.$networkHandler.post(this.url, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
