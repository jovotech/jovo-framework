import {
  Action,
  CoreComponent,
  InputRecordEvents,
  JovoWebClient,
  RequestEvents,
  ResponseComponentConfig,
  ResponseEvents,
} from '../..';

export class RepromptTimer extends CoreComponent {
  readonly name = 'RepromptTimer';

  private $actions: Action[] = [];
  private $attempts = 0;
  private $activeRepromptTimerId = -1;
  private $activeTimeoutTimerId = -1;

  constructor(protected readonly $client: JovoWebClient) {
    super($client);
    $client.on(InputRecordEvents.Started, this.onRecordingStarted.bind(this));
    $client.on(InputRecordEvents.Timeout, this.onTimeout.bind(this));
    $client.on(RequestEvents.Data, this.onInputRetrieved.bind(this));
    $client.on(RequestEvents.Result, this.onInputRetrieved.bind(this));
  }

  get attempts(): number {
    return this.$attempts;
  }

  get responseConfig(): ResponseComponentConfig {
    return this.$client.$config.ResponseComponent;
  }

  get maxAttempts(): number {
    return this.responseConfig.reprompt.maxAttempts;
  }

  get interval(): number {
    return this.responseConfig.reprompt.interval;
  }

  get isPushToTalkUsed(): boolean {
    return this.$client.$config.InputComponent.mode === 'push-to-talk';
  }

  handle(actions: Action[]) {
    this.$actions = actions;
    this.startReprompt();
  }

  abort() {
    this.onInputRetrieved();
  }

  private onRecordingStarted() {
    if (this.$activeTimeoutTimerId !== -1) {
      clearTimeout(this.$activeTimeoutTimerId);
      this.$activeTimeoutTimerId = -1;
    }
  }

  private onTimeout() {
    if (this.$actions.length === 0) {
      clearTimeout(this.$activeRepromptTimerId);
      this.$activeRepromptTimerId = -1;
      return;
    }
    if (this.maxAttempts === 0 || this.attempts < this.maxAttempts) {
      this.$activeRepromptTimerId = (setTimeout(async () => {
        this.$client.emit(ResponseEvents.Reprompt, this.$actions);

        for (let i = 0, len = this.$actions.length; i < len; i++) {
          await this.$client.actionHandler.handleAction(this.$actions[i]);
        }

        this.startReprompt();

        this.$attempts++;
      }, this.interval) as unknown) as number;
    } else {
      this.$client.emit(ResponseEvents.MaxRepromptsReached);
      this.onInputRetrieved();
    }
  }

  private startReprompt() {
    if (this.$actions.length > 0) {
      if (this.isPushToTalkUsed) {
        this.$activeTimeoutTimerId = (setTimeout(() => {
          this.$client.emit(InputRecordEvents.Timeout);
        }, this.interval) as unknown) as number;
      } else {
        this.$client.input.startRecording();
      }
    }
  }

  private onInputRetrieved() {
    this.$client.off(InputRecordEvents.Timeout, this.onTimeout);
    this.$client.off(InputRecordEvents.Recorded, this.onInputRetrieved);
    this.$client.off(RequestEvents.Data, this.onInputRetrieved);
    this.$client.off(RequestEvents.Result, this.onInputRetrieved);
    this.$actions = [];
    this.$attempts = 0;
  }
}
