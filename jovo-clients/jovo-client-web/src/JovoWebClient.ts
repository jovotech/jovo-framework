import {
  AdvancedEventEmitter,
  AssistantEvents,
  AudioPlayer,
  Component,
  ComponentConstructor,
  Config,
  ConversationComponent,
  InitConfig,
  InputComponent,
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

export enum DefaultInputMode {
  Voice = 'voice',
  Text = 'text',
}

export function makeDefaultConfig(type: DefaultInputMode = DefaultInputMode.Voice): Config {
  return {
    debugMode: false,
    initBaseComponents: true,
    launchFirst: true,
    locale: navigator.language,
    audioPlayer: {
      enabled: type === DefaultInputMode.Voice,
    },
    speechSynthesis: {
      enabled: type === DefaultInputMode.Voice,
      automaticallySetLanguage: true,
    },
    LoggerComponent: LoggerComponent.DEFAULT_CONFIG,
    ConversationComponent: {
      ...ConversationComponent.DEFAULT_CONFIG,
      showSessionEnd: type === DefaultInputMode.Voice,
    },
    InputComponent: {
      ...InputComponent.DEFAULT_CONFIG,
      mode: type === DefaultInputMode.Voice ? 'default' : 'push-to-talk',
    },
    RequestComponent: RequestComponent.DEFAULT_CONFIG,
    ResponseComponent: {
      ...ResponseComponent.DEFAULT_CONFIG,
      reprompt: {
        ...ResponseComponent.DEFAULT_CONFIG.reprompt,
        enabled: type === DefaultInputMode.Voice,
      },
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

  constructor(readonly url: string, config?: InitConfig) {
    super();

    const defaultConfig = makeDefaultConfig(config?.defaultInputType);
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

    this.on(AssistantEvents.LaunchRequest, () => {
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
    this.emit(AssistantEvents.Loaded);
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
      const clientConfig = this.$config[component.name];

      let componentConfig = defaultConfig;
      if (clientConfig) {
        componentConfig = merge(componentConfig, clientConfig);
      }
      if (component.initConfig) {
        componentConfig = merge(componentConfig, component.initConfig);
      }
      this.$config[component.name] = componentConfig;
      this.$components.push(component);
    }
  }
}
