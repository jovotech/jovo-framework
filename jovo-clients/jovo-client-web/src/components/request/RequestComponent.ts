import uuid = require('uuid');
import {
  assistantEvents,
  AudioRecordedPayload,
  Base64Converter,
  Component,
  ComponentConfig,
  InputEvents,
  InputRecordEvents,
  NetworkHandler,
  NetworkResponse,
  RequestEvents,
  VERSION,
} from '../..';
import { AjaxAdapter } from './adapters/AjaxAdapter';

export interface RequestComponentConfig extends ComponentConfig {}

// TODO link with types of core-platform as soon as TS 3.8 is released or do a workaround which breaks the conventions tho
export class RequestComponent extends Component<RequestComponentConfig> {
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
    this.$client.prependListener(assistantEvents.LaunchRequest, this.onFirstRequest.bind(this));
    this.$client.on(InputEvents.Text, this.onSendText.bind(this));
    this.$client.on(InputRecordEvents.Recorded, this.onAudioRecorded.bind(this));
    this.$client.on(InputRecordEvents.SpeechRecognized, this.onSpeechRecognized.bind(this));
  }

  getDefaultConfig(): RequestComponentConfig {
    return {};
  }

  private async onFirstRequest() {
    if (!this.$client.hasSentLaunchRequest && this.shouldLaunchFirst) {
      return this.send('LAUNCH');
    }
  }

  private async onAudioRecorded(payload: AudioRecordedPayload) {
    if (payload.forward) {
      const base64EncodedAudio = await Base64Converter.blobToBase64(payload.raw);
      return this.send('AUDIO', {
        audio: {
          sampleRate: payload.sampleRate,
          b64string: base64EncodedAudio,
        },
      });
    }
  }

  private async onSpeechRecognized(event: SpeechRecognitionEvent) {
    if (!this.isPushToTalkUsed && event.results[0].isFinal) {
      // TODO should be replaced with a request-type that shows that the value is derived from speech recognition
      return this.send('TEXT', {
        text: event.results[0][0].transcript,
      });
    }
  }

  private async onSendText(text: string) {
    return this.send('TEXT', {
      text,
    });
  }

  // tslint:disable-next-line:no-any
  private async handleSendRequest(data: any) {
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
  private send(type: string, body: Record<string, any> = {}) {
    // TODO fill missing data like appId and platform
    const requestData = {
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
          type: 'BROWSER',
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

  // tslint:disable-next-line:no-any
  private sendRequest(data: any): Promise<NetworkResponse> {
    const jsonData = JSON.stringify(data);
    return this.$networkHandler.post(this.url, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
