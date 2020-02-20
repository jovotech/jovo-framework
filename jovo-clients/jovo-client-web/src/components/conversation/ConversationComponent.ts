import {
  Action,
  ActionType,
  AudioHelper,
  Base64Converter,
  Component,
  ComponentConfig,
  ConversationEvents,
  ConversationPart,
  CoreRequest,
  CoreResponse,
  RequestEvents,
  RequestType,
  ResponseEvents,
  StoreEvents,
} from '../..';

declare module '../../core/Interfaces' {
  interface Config {
    ConversationComponent: ConversationComponentConfig;
  }
}

export interface ConversationComponentConfig extends ComponentConfig {
  showSessionEnd: boolean;
  showStart: boolean;
}

export class ConversationComponent extends Component<ConversationComponentConfig> {
  static DEFAULT_CONFIG: ConversationComponentConfig = {
    showSessionEnd: true,
    showStart: true,
  };

  readonly name = 'ConversationComponent';

  parts: ConversationPart[] = [];
  endSession = false;

  async onInit(): Promise<void> {
    this.$client.on(RequestEvents.Data, this.onRequest.bind(this));
    this.$client.prependListener(RequestEvents.Success, this.onResponse.bind(this));
    this.$client.on(ResponseEvents.Action, this.onAction.bind(this));
    this.$client.on(StoreEvents.NewSession, this.onNewSession.bind(this));
  }

  getDefaultConfig(): ConversationComponentConfig {
    return ConversationComponent.DEFAULT_CONFIG;
  }

  private async onRequest(req: CoreRequest) {
    const { body, type } = req.request;
    if (type === RequestType.Launch && this.$config.showStart) {
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

  private onResponse(res: CoreResponse) {
    const lastPart = this.parts[this.parts.length - 1];
    if (
      lastPart &&
      lastPart.type === 'request' &&
      lastPart.subType === 'audio' &&
      res.context.request.asr
    ) {
      this.parts[this.parts.length - 1].label = res.context.request.asr.text || '';
    }
  }

  private onAction(action: Action) {
    // TODO finish implementation / check if works as expected
    if (action.type === ActionType.Speech) {
      return this.addPart({
        label: action.displayText || action.plain || '',
        value: action.ssml, // TODO check if the value should be set to ssml
        type: 'response',
        subType: 'text-audio',
      });
    }
  }

  private onNewSession(forced: boolean) {
    if (this.$config.showSessionEnd) {
      if (forced) {
        this.addSessionEndPart();
      } else {
        this.endSession = true;
      }
    }
  }

  private addPart(part: Partial<ConversationPart>) {
    this.parts.push(part as ConversationPart);
    this.$client.emit(ConversationEvents.Change, this.parts);
    this.$client.emit(ConversationEvents.AddPart, part);

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
