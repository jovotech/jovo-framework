import {
  AudioRecordedPayload,
  Base64Converter,
  Component,
  ComponentOptions,
  InputEvents,
  InputRecordEvents,
  NetworkHandler,
  NetworkResponse,
  RequestEvents,
  WebAssistantEvents,
} from '../..';
import { AjaxAdapter } from './adapters/AjaxAdapter';

export interface RequestComponentOptions extends ComponentOptions {}

export class RequestComponent extends Component<RequestComponentOptions> {
  private $networkHandler!: NetworkHandler;

  get url(): string {
    return this.$client.url;
  }

  get isPushToTalkUsed(): boolean {
    return this.$client.options.InputComponent.mode === 'push-to-talk';
  }

  get locale(): string {
    return this.$client.options.locale;
  }

  get shouldLaunchFirst(): boolean {
    return this.$client.options.launchFirst;
  }

  async onInit(): Promise<void> {
    const adapter = new AjaxAdapter(this.$client);
    this.$networkHandler = new NetworkHandler(adapter);
    this.$client.prependListener(WebAssistantEvents.LaunchRequest, this.onFirstRequest.bind(this));
    this.$client.on(InputEvents.Text, this.onSendText.bind(this));
    this.$client.on(InputRecordEvents.Recorded, this.onAudioRecorded.bind(this));
    this.$client.on(InputRecordEvents.SpeechRecognized, this.onSpeechRecognized.bind(this));
  }

  getDefaultOptions(): RequestComponentOptions {
    return {};
  }

  private async onFirstRequest() {
    if (!this.$client.hasSentLaunchRequest && this.shouldLaunchFirst) {
      const data = this.makeRequest({
        isLaunch: true,
      });
      await this.handleSendRequest(data);
    }
  }

  private async onAudioRecorded(payload: AudioRecordedPayload) {
    if (payload.forward) {
      const base64EncodedAudio = await Base64Converter.blobToBase64(payload.sampled);
      const data = this.makeRequest({
        audio: base64EncodedAudio,
      });

      await this.handleSendRequest(data);
    }
  }

  private async onSpeechRecognized(event: SpeechRecognitionEvent) {
    if (!this.isPushToTalkUsed && event.results[0].isFinal) {
      await this.onSendText(event.results[0][0].transcript);
    }
  }

  private async onSendText(text: string, fromVoice = true) {
    const data = this.makeRequest({
      fromVoice,
      text,
    });
    await this.handleSendRequest(data);
  }

  private async handleSendRequest(data: any) {
    try {
      const res = await this.sendRequest(data);
      this.$client.emit(RequestEvents.Result, res);
      if (
        res.status &&
        res.status === 200 &&
        res.data &&
        res.data.response &&
        !res.data.response.outputSpeech
      ) {
        this.$client.emit(RequestEvents.Success, res.data);
      } else {
        this.$client.emit(RequestEvents.Error, new Error('No valid response was received.'));
      }
    } catch (e) {
      this.$client.emit(RequestEvents.Error, e);
    }
  }

  private makeRequest(baseData: any) {
    // TODO add missing pieces of information!
    const requestData = {
      version: '1.0.0',
      request: {
        locale: this.locale,
        timestamp: new Date().toISOString(),
      },
      session: this.$client.store.session,
      user: this.$client.store.user,
    };

    Object.assign(requestData, baseData);

    if (this.$client.options.debugMode) {
      // tslint:disable-next-line:no-console
      console.log('[REQ]', requestData);
    }

    this.$client.emit(RequestEvents.Data, requestData);
    return requestData;
  }

  private sendRequest(data: any): Promise<NetworkResponse> {
    const jsonData = JSON.stringify(data);
    return this.$networkHandler.post(this.url, jsonData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
