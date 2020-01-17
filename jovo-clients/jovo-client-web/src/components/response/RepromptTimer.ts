import {
  InputRecordEvents,
  Output,
  RequestEvents,
  ResponseComponentOptions,
  ResponseEvents,
  JovoWebClient,
} from '../..';

export class RepromptTimer {
  private $reprompt: Output | null = null;
  private $attempts: number = 0;
  private $activeRepromptTimerId: number = -1;
  private $activeTimeoutTimerId: number = -1;

  constructor(private readonly $client: JovoWebClient) {
    $client.on(InputRecordEvents.Started, this.onRecordingStarted.bind(this));
    $client.on(InputRecordEvents.Timeout, this.onTimeout.bind(this));
    $client.on(RequestEvents.Data, this.onInputRetrieved.bind(this));
    $client.on(RequestEvents.Result, this.onInputRetrieved.bind(this));
  }

  get attempts(): number {
    return this.$attempts;
  }

  get responseOptions(): ResponseComponentOptions {
    return this.$client.options.ResponseComponent;
  }

  get maxAttempts(): number {
    return this.responseOptions.reprompt.maxAttempts;
  }

  get interval(): number {
    return this.responseOptions.reprompt.interval;
  }

  get isPushToTalkUsed(): boolean {
    return this.$client.options.InputComponent.mode === 'push-to-talk';
  }

  handle(reprompt: Output) {
    this.$reprompt = reprompt;
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
    if (!this.$reprompt) {
      clearTimeout(this.$activeRepromptTimerId);
      this.$activeRepromptTimerId = -1;
      return;
    }
    if (this.maxAttempts === 0 || this.attempts < this.maxAttempts) {
      this.$activeRepromptTimerId = setTimeout(async () => {
        this.$client.emit(ResponseEvents.Reprompt, this.$reprompt);

        await this.$client.ssmlEvaluator.evaluate(this.$reprompt!.ssml);

        this.startReprompt();

        this.$attempts++;
      }, this.interval) as any;
    } else {
      this.$client.emit(ResponseEvents.MaxRepromptsReached);
      this.onInputRetrieved();
    }
  }

  private startReprompt() {
    if (this.$reprompt) {
      if (this.isPushToTalkUsed) {
        this.$activeTimeoutTimerId = setTimeout(() => {
          this.$client.emit(InputRecordEvents.Timeout);
        }, this.interval) as any;
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
    this.$reprompt = null;
    this.$attempts = 0;
  }
}
