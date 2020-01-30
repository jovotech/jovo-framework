import {
  Action,
  Card,
  Component,
  ComponentConfig,
  JovoWebClient,
  Output,
  RepromptTimer,
  RequestEvents,
  ResponseEvents,
  AssistantResponse,
} from '../..';

export interface ResponseComponentConfig extends ComponentConfig {
  reprompt: {
    interval: number;
    maxAttempts: number;
  };
}

export class ResponseComponent extends Component<ResponseComponentConfig> {
  static DEFAULT_CONFIG: ResponseComponentConfig = {
    reprompt: {
      interval: 2000,
      maxAttempts: 3,
    },
  };

  cardParent: HTMLElement | null = null;
  suggestionChipsParent: HTMLElement | null = null;

  private readonly $repromptTimer: RepromptTimer;
  private $isRunning = false;

  constructor(
    protected readonly $client: JovoWebClient,
    protected readonly $initConfig?: Partial<ResponseComponentConfig>,
  ) {
    super($client, $initConfig);
    this.$repromptTimer = new RepromptTimer($client);
    this.addSuggestionChipStyle();
  }

  async onInit(): Promise<void> {
    this.$client.on(RequestEvents.Data, this.onRequest.bind(this));
    this.$client.on(RequestEvents.Success, this.onResponse.bind(this));
  }

  getDefaultConfig(): ResponseComponentConfig {
    return ResponseComponent.DEFAULT_CONFIG;
  }

  private async onRequest() {
    this.removeSuggestionChipsIfAny();

    if (this.$isRunning) {
      this.$isRunning = false;
      this.$repromptTimer.abort();
      this.$client.audioPlayer.stopAll();
      this.$client.speechSynthesizer.stop();
      this.$client.input.abortRecording();
    }
  }

  private async onResponse(data: AssistantResponse) {
    this.$isRunning = true;
    if (data && data.response && data.response.output) {
      if (this.$client.$config.debugMode) {
        // tslint:disable-next-line:no-console
        console.log('[RES]', data);
      }

      if (data.response.output.actions && data.response.output.actions.length > 0) {
        this.emitActions(data.response.output.actions);
      }

      if (data.response.output.suggestionChips && data.response.output.suggestionChips.length > 0) {
        this.handleSuggestionChips(data.response.output.suggestionChips);
      }

      if (data.response.output.card) {
        this.handleCard(data.response.output.card);
      }

      if (data.response.output.speech && this.$isRunning) {
        await this.handleSpeech(data.response.output.speech);
      }

      if (data.response.output.reprompt && this.$isRunning) {
        await this.handleReprompt(data.response.output.reprompt);
      } else {
        this.$repromptTimer.abort();
      }
      this.$isRunning = false;
    }
  }

  private async handleSpeech(speech: Output) {
    this.$client.emit(ResponseEvents.Speech, speech);
    return this.$client.ssmlEvaluator.evaluate(speech.ssml);
  }

  private async handleReprompt(reprompt: Output) {
    this.$repromptTimer.handle(reprompt);
  }

  private handleCard(card: Card) {
    this.$client.emit(ResponseEvents.Card, card);
    this.$client.adaptiveCards.parse(card);
    this.$client.adaptiveCards.render(this.cardParent || document.body);
  }

  private handleSuggestionChips(chips: string[]) {
    this.$client.emit(ResponseEvents.SuggestionChips, chips);
    this.renderSuggestionChips(chips);
  }

  private removeSuggestionChipsIfAny() {
    const existingRoot = document.getElementById('suggestion-chip-root');
    if (existingRoot) {
      existingRoot.remove();
    }
  }

  private renderSuggestionChips(chips: string[]) {
    const parentElement = this.suggestionChipsParent || document.body;
    const rootElement = document.createElement('div');
    rootElement.id = 'suggestion-chip-root';
    rootElement.className = 'suggestion-chip-root';

    chips.forEach((chip: string) => {
      const chipElement = document.createElement('div');
      chipElement.className = 'suggestion-chip';
      chipElement.innerText = chip;
      chipElement.addEventListener('click', () => {
        this.$client.input.sendText(chip, false);
      });

      rootElement.appendChild(chipElement);
    });

    parentElement.appendChild(rootElement);
  }

  private emitActions(actions: Action[]) {
    for (const action of actions) {
      this.$client.emit(action.key, action.value);
    }
  }

  private addSuggestionChipStyle() {
    const style = document.createElement('style');
    style.innerHTML = `.suggestion-chip {
            background: #eee;
            border: .5px solid #ddd;
            border-radius: 5px;
            cursor: pointer;
            display: inline-block;
            margin-right: 5px;
            padding: 8px 4px;
        } .suggestion-chip:hover {
           background: #fff;
        }`;
    const ref = document.querySelector('script');
    if (ref && ref.parentNode) {
      ref.parentNode!.insertBefore(style, ref);
    }
  }
}
