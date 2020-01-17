import * as AdaptiveCards from 'adaptivecards';
import merge = require('lodash.merge');
import * as markdownit from 'markdown-it';
import {
  ASSISTANT_DEFAULT_OPTIONS,
  AudioPlayer,
  Component,
  ComponentConstructor,
  ConversationComponent,
  InputComponent,
  JovoWebClientOptions,
  Logger,
  LoggerComponent,
  LoggerEvents,
  Options,
  RequestComponent,
  ResponseComponent,
  SpeechSynthesizer,
  Store,
  WebAssistantEvents,
} from './';
import { AdvancedEventEmitter } from './core/AdvancedEventEmitter';
import { SSMLEvaluator } from './core/SSMLEvaluator';

export class JovoWebClient extends AdvancedEventEmitter {
  options: Options;
  private $hasSentLaunchRequest = false;
  private $isRunning = false;
  private $volume = 1.0;
  private readonly $components: Component[];
  private readonly $store: Store;
  private readonly $audioPlayer: AudioPlayer;
  private readonly $speechSynthesizer: SpeechSynthesizer;
  private readonly $ssmlEvaluator: SSMLEvaluator;
  private readonly $adaptiveCards: AdaptiveCards.AdaptiveCard;

  constructor(readonly url: string, options?: Partial<JovoWebClientOptions>) {
    super();

    const defaultOptions = ASSISTANT_DEFAULT_OPTIONS();
    this.options = options ? merge(defaultOptions, options) : defaultOptions;

    this.$components = [];
    // Workflow components
    if (this.options.initBaseComponents) {
      this.initBaseComponents(
        LoggerComponent,
        InputComponent,
        RequestComponent,
        ResponseComponent,
        ConversationComponent,
      );
    }

    // Core components (used by several workflow components)
    this.$store = new Store(this);
    this.$audioPlayer = new AudioPlayer(this);
    this.$speechSynthesizer = new SpeechSynthesizer(this);
    this.$ssmlEvaluator = new SSMLEvaluator(this);

    this.$adaptiveCards = new AdaptiveCards.AdaptiveCard();
    this.setupAdaptiveCards();

    this.on(WebAssistantEvents.LaunchRequest, () => {
      this.$hasSentLaunchRequest = true;
    });

    if (this.options.debugMode) {
      this.onEmit = (type: string | symbol, ...args: any[]) => {
        if (type === LoggerEvents.Log) {
          return;
        }
        this.logger.debug(`[${type.toString()}]`);
      };
    }
  }

  get isRunning(): boolean {
    return this.$isRunning;
  }

  get hasSentLaunchRequest(): boolean {
    return this.$hasSentLaunchRequest;
  }

  get input(): InputComponent {
    return this.component<InputComponent>('InputComponent')!;
  }

  get logger(): Logger {
    return this.component<Logger>('LoggerComponent')!;
  }

  get store(): Store {
    return this.$store;
  }

  get audioPlayer(): AudioPlayer {
    return this.$audioPlayer;
  }

  get speechSynthesizer(): SpeechSynthesizer {
    return this.$speechSynthesizer;
  }

  get ssmlEvaluator(): SSMLEvaluator {
    return this.$ssmlEvaluator;
  }

  get adaptiveCards(): AdaptiveCards.AdaptiveCard {
    return this.$adaptiveCards;
  }

  get volume(): number {
    return this.$volume;
  }

  set volume(value: number) {
    // clamp
    value = value < 0 ? 0 : value;
    value = value > 1 ? 1 : value;
    this.$volume = value;
    this.audioPlayer.volume = value;
    this.speechSynthesizer.volume = value;
  }

  isSpeechSynthesizerAvailable(): boolean {
    return this.$speechSynthesizer.isAvailable;
  }

  component<T extends Component>(name: string): T | undefined {
    return this.$components.find((component: Component) => {
      return component.name === name;
    }) as T | undefined;
  }

  use(...components: Component[]): this {
    components.forEach((component: Component) => {
      this.handleUseComponent(component);
    });
    return this;
  }

  removeComponent(componentName: string) {
    const index = this.$components.findIndex((component: Component) => {
      return component.name === componentName;
    });
    if (index >= 0) {
      this.$components.splice(index, 1);
    }
  }

  removeAllComponents() {
    this.$components.length = 0;
  }

  async start() {
    for (const component of this.$components) {
      await component.onInit();
    }
    this.emit(WebAssistantEvents.Loaded);
    this.$isRunning = true;
  }

  async stop() {
    for (const component of this.$components) {
      await component.onStop();
    }
    this.$isRunning = false;
  }

  private initBaseComponents(...componentConstructors: ComponentConstructor[]) {
    componentConstructors.forEach((constructor: ComponentConstructor) => {
      this.handleUseComponent(new constructor(this));
    });
  }

  private handleUseComponent(component: Component) {
    if (
      this.$components.some((registeredComponent: Component) => {
        return registeredComponent.name === component.name;
      })
    ) {
      // component with that name exists already -> merge options
      if (component.initOptions) {
        this.options[component.name] = merge(
          this.options[component.name] || {},
          component.initOptions,
        );
      }
    } else {
      // component with that name does not exist -> add to array and add options
      const defaultOptions = component.getDefaultOptions();
      this.options[component.name] = component.initOptions
        ? merge(defaultOptions, component.initOptions)
        : defaultOptions;
      this.$components.push(component);
    }
  }

  private setupAdaptiveCards() {
    // this.$adaptiveCards.hostConfig = new AdaptiveCards.HostConfig();
    // TODO allow setting hostconfig!

    // enable markdown-it
    AdaptiveCards.AdaptiveCard.onProcessMarkdown = (
      text: string,
      result: AdaptiveCards.IMarkdownProcessingResult,
    ) => {
      result.outputHtml = new markdownit().render(text);
      result.didProcess = true;
    };

    // react to card-actions
    this.$adaptiveCards.onExecuteAction = (action: any) => {
      //   TODO implement
    };
  }
}
