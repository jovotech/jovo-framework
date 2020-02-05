import {
  AudioHelper,
  AudioPlayerEvents,
  Base64Converter,
  Component,
  ComponentConfig,
  ConversationEvents,
  ConversationPart,
  CoreRequest,
  RequestEvents,
  RequestType,
  SpeechSynthesizerEvents,
  StoreEvents,
} from '../..';

export interface ConversationComponentConfig extends ComponentConfig {}

export class ConversationComponent extends Component<ConversationComponentConfig> {
  parts: ConversationPart[] = [];
  endSession = false;

  async onInit(): Promise<void> {
    this.$client.on(RequestEvents.Data, this.onRequest.bind(this));
    this.$client.on(SpeechSynthesizerEvents.Speak, this.onSpeak.bind(this));
    this.$client.on(AudioPlayerEvents.Play, this.onAudioPlay.bind(this));
    this.$client.on(StoreEvents.NewSession, this.onNewSession.bind(this));
  }

  getDefaultConfig(): ConversationComponentConfig {
    return {};
  }

  private async onRequest(req: CoreRequest) {
    const { body, type } = req.request;
    if (type === RequestType.Launch) {
      return this.addPart({
        label: 'Started',
        subType: 'start',
        type: 'request',
      });
    }
    if (type === RequestType.Audio && body.audio) {
      const arrayBuffer = await Base64Converter.base64ToArrayBuffer(body.audio.b64string);
      const bufferView = new Float32Array(arrayBuffer);
      const blob = AudioHelper.toWavBlob(bufferView, body.audio.sampleRate);
      const source = URL.createObjectURL(blob);
      return this.addPart({
        label: '',
        subType: 'audio',
        type: 'request',
        value: source,
      });
    }
    if (type === RequestType.Text || type === RequestType.TranscribedText) {
      return this.addPart({
        label: body.text,
        subType: 'text',
        type: 'request',
      });
    }
  }

  private onSpeak(utterance: SpeechSynthesisUtterance) {
    this.addPart({
      label: utterance.text,
      subType: 'text',
      type: 'response',
    });
  }

  private onAudioPlay(id: number, source: string) {
    this.addPart({
      label: '',
      subType: 'audio',
      type: 'response',
      value: source,
    });
  }

  private onNewSession(forced: boolean) {
    if (forced) {
      this.addSessionEndPart();
    } else {
      this.endSession = true;
    }
  }

  private addPart(part: Partial<ConversationPart>) {
    this.parts.push(part as ConversationPart);
    this.$client.emit(ConversationEvents.Change, this.parts);

    if (this.endSession) {
      this.endSession = false;
      this.addSessionEndPart();
    }
  }

  private addSessionEndPart() {
    this.addPart({
      label: 'Session ended',
      subType: 'end',
      type: 'response',
    });
  }
}
