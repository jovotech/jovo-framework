import {
  Card,
  Component,
  ComponentConfig,
  JovoWebClient,
  RepromptTimer,
  RequestEvents,
  ResponseEvents,
} from '../..';

export interface ResponseComponentConfig extends ComponentConfig {
  reprompt: {
    interval: number;
    maxAttempts: number;
  };
}

// TODO refactor when TS 3.8 was introduced or workaround was done, that types only are imported from jovo-platform-core
export class ResponseComponent extends Component<ResponseComponentConfig> {
  static DEFAULT_CONFIG: ResponseComponentConfig = {
    reprompt: {
      interval: 2000,
      maxAttempts: 3,
    },
  };

  cardParent: HTMLElement | null = null;

  private readonly $repromptTimer: RepromptTimer;
  private $isRunning = false;

  constructor(
    protected readonly $client: JovoWebClient,
    protected readonly $initConfig?: Partial<ResponseComponentConfig>,
  ) {
    super($client, $initConfig);
    this.$repromptTimer = new RepromptTimer($client);
  }

  async onInit(): Promise<void> {
    this.$client.on(RequestEvents.Data, this.onRequest.bind(this));
    this.$client.on(RequestEvents.Success, this.onResponse.bind(this));
  }

  getDefaultConfig(): ResponseComponentConfig {
    return ResponseComponent.DEFAULT_CONFIG;
  }

  private async onRequest() {
    if (this.$isRunning) {
      this.$isRunning = false;
      this.$repromptTimer.abort();
      this.$client.audioPlayer.stopAll();
      this.$client.speechSynthesizer.stop();
      this.$client.input.abortRecording();
    }
  }

  // tslint:disable-next-line:no-any
  private async onResponse(data: any) {
    this.$isRunning = true;
    if (data && data.response && data.response.output) {
      if (this.$client.$config.debugMode) {
        // tslint:disable-next-line:no-console
        console.log('[RES]', data);
      }
      if (data.response.output.card) {
        this.handleCard(data.response.output.card);
      }

      // if (data.response.output.speech && this.$isRunning) {
      //   await this.handleSpeech(data.response.output.speech);
      // }
      //
      // if (data.response.output.reprompt && this.$isRunning) {
      //   await this.handleReprompt(data.response.output.reprompt);
      // } else {
      //   this.$repromptTimer.abort();
      // }

      this.$isRunning = false;
    }
  }

  private handleCard(card: Card) {
    this.$client.emit(ResponseEvents.Card, card);
    this.$client.adaptiveCards.parse(card);
    this.$client.adaptiveCards.render(this.cardParent || document.body);
  }
}
