import {
  Component,
  ComponentConfig,
  ConversationEvents,
  ConversationPart,
  InputRecordEvents,
  RequestEvents,
  ResponseEvents,
  StoreEvents,
} from '../..';

export interface ConversationComponentConfig extends ComponentConfig {}

// TODO Rework when TS 3.8 was published or a workaround was developed for type-only imports.
export class ConversationComponent extends Component<ConversationComponentConfig> {
  parts: ConversationPart[] = [];
  addNextResponse = false;
  endSession = false;
  endSpeechRecognition = false;
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

  getDefaultConfig(): ConversationComponentConfig {
    return {};
  }

  // tslint:disable-next-line:no-any
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

  // tslint:disable-next:no-any
  private onResponse(res: any) {
    // if (this.addNextResponse) {
    //   this.addPart({
    //     label: res.response.inputText!,
    //     subType: 'speech',
    //     type: 'request',
    //     value: res,
    //   });
    // }
  }

  // tslint:disable-next:no-any
  private onSpeech(speech: any) {
    // this.addPart({
    //   label: speech.text,
    //   subType: 'speech',
    //   type: 'response',
    //   value: speech,
    // });
  }

  // tslint:disable-next:no-any
  private onReprompt(reprompt: any) {
    // this.addPart({
    //   label: reprompt.text,
    //   subType: 'reprompt',
    //   type: 'response',
    //   value: reprompt,
    // });
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
