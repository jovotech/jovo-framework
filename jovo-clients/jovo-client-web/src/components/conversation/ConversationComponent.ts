import {
  Component,
  ComponentOptions,
  ConversationEvents,
  ConversationPart,
  InputRecordEvents,
  Output,
  RequestEvents,
  ResponseEvents,
  StoreEvents,
  WebAssistantResponse,
} from '../..';

export interface ConversationComponentOptions extends ComponentOptions {}

export class ConversationComponent extends Component<ConversationComponentOptions> {
  parts: ConversationPart[] = [];
  addNextResponse: boolean = false;
  endSession: boolean = false;
  endSpeechRecognition: boolean = false;
  currentPart: ConversationPart | null = null;

  async onInit(): Promise<void> {
    this.$client.on(InputRecordEvents.Started, () => {
      this.currentPart = null;
      this.addNextResponse = false;
    });
    this.$client.on(RequestEvents.Data, this.onRequest.bind(this));
    this.$client.on(RequestEvents.Success, this.onResponse.bind(this));
    this.$client.on(ResponseEvents.Speech, this.onSpeech.bind(this));
    this.$client.on(ResponseEvents.Reprompt, this.onReprompt.bind(this));
    this.$client.on(StoreEvents.NewSession, this.onNewSession.bind(this));
  }

  getDefaultOptions(): ConversationComponentOptions {
    return {};
  }

  private onRequest(req: any) {
    if (req.isLaunch) {
      this.addPart({
        label: 'LAUNCH',
        subType: 'start',
        type: 'request',
      });
    } else if (!req.text && req.audio) {
      this.addNextResponse = true;
    } else if (req.text) {
      this.addPart({
        label: req.text,
        subType: req.fromVoice ? 'speech' : 'text',
        type: 'request',
      });
    }

    if (this.currentPart) {
      this.addPart(this.currentPart);
      this.currentPart = null;
    }
  }

  private onResponse(res: WebAssistantResponse) {
    if (this.addNextResponse) {
      this.addPart({
        label: res.response.inputText!,
        subType: 'speech',
        type: 'request',
        value: res,
      });
    }
  }

  private onSpeech(speech: Output) {
    this.addPart({
      label: speech.text,
      subType: 'speech',
      type: 'response',
      value: speech,
    });
  }

  private onReprompt(reprompt: Output) {
    this.addPart({
      label: reprompt.text,
      subType: 'reprompt',
      type: 'response',
      value: reprompt,
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
