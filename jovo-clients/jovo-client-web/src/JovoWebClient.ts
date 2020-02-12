import {
  AdvancedEventEmitter,
  assistantEvents,
  AudioPlayer,
  Component,
  ComponentConstructor,
  Config,
  ConversationComponent,
  InputComponent,
  JovoWebClientConfig,
  Logger,
  LoggerComponent,
  LoggerEvents,
  RequestComponent,
  ResponseComponent,
  SpeechSynthesizer,
  SSMLEvaluator,
  Store,
} from './';
import { ActionHandler } from './core/ActionHandler';
// tslint:disable-next-line
import merge = require('lodash.merge');

export function makeDefaultConfig(): Config {
  return {
    debugMode: false,
    initBaseComponents: true,
    launchFirst: true,
    locale: navigator.language,
    speechSynthesis: {
      enabled: true,
      automaticallySetLanguage: true,
    },
  };
}

export class JovoWebClient extends AdvancedEventEmitter {
  $config: Config;

  private launchRequestWasSent = false;

  private $volume = 1.0;
  private readonly $components: Component[];

  private readonly $store: Store;
  private readonly $audioPlayer: AudioPlayer;
  private readonly $speechSynthesizer: SpeechSynthesizer;
  private readonly $ssmlEvaluator: SSMLEvaluator;
  private readonly $actionHandler: ActionHandler;

  constructor(readonly url: string, config?: Partial<JovoWebClientConfig>) {
    super();

    const defaultConfig = makeDefaultConfig();
    this.$config = config ? merge(defaultConfig, config) : defaultConfig;

    this.$components = [];
    // Workflow components
    if (this.$config.initBaseComponents) {
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
    this.$actionHandler = new ActionHandler(this);

    this.on(assistantEvents.LaunchRequest, () => {
      this.launchRequestWasSent = true;
    });

    if (this.$config.debugMode) {
      // tslint:disable-next-line:no-any
      this.onEmit = (type: string | symbol, ...args: any[]) => {
        if (type === LoggerEvents.Log) {
          return;
        }
        this.logger.debug(`[${type.toString()}]`);
      };
    }
  }

  get actionHandler(): ActionHandler {
    return this.$actionHandler;
  }

  get hasSentLaunchRequest(): boolean {
    return this.launchRequestWasSent;
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
    this.emit(assistantEvents.Loaded);
  }

  async stop() {
    for (const component of this.$components) {
      await component.onStop();
    }
  }

  private initBaseComponents(...componentConstructors: ComponentConstructor[]) {
    componentConstructors.forEach((constructor: ComponentConstructor) => {
      this.handleUseComponent(new constructor(this));
    });
  }

  private handleUseComponent(component: Component) {
    const componentExists = this.$components.some((registeredComponent: Component) => {
      return registeredComponent.name === component.name;
    });
    if (componentExists) {
      // component with that name exists already -> merge $config
      if (component.initConfig) {
        this.$config[component.name] = merge(
          this.$config[component.name] || {},
          component.initConfig,
        );
      }
    } else {
      // component with that name does not exist -> add to array and add $config
      const defaultConfig = component.getDefaultConfig();
      this.$config[component.name] = component.initConfig
        ? merge(defaultConfig, component.initConfig)
        : defaultConfig;
      this.$components.push(component);
    }
  }
}
