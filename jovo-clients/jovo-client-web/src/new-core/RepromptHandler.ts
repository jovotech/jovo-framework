import { Action } from '..';
import { Client } from '../Client';
import { AudioRecorderEvent } from '../standalone/AudioRecorder';

export interface RepromptHandlerConfig {
  timeoutInMs: number;
  maxAttempts: number;
}

// TODO refactor to work with SpeechRecognizer as well & add events
export class RepromptHandler {
  get config(): RepromptHandlerConfig {
    return this.$client.config.repromptHandler;
  }

  static getDefaultConfig(): RepromptHandlerConfig {
    return {
      timeoutInMs: 2000,
      maxAttempts: 1,
    };
  }

  private actions: Action[] = [];
  private attempts = 0;
  private hasAddedEvents = false;

  private timeoutFn = this.onInputTimeout.bind(this);
  private endFn = this.onInputEnd.bind(this);

  constructor(readonly $client: Client) {}

  async handleReprompts(repromptActions: Action[]) {
    this.actions = repromptActions;
    this.hasAddedEvents = false;
    return this.startReprompt();
  }

  async onInputTimeout() {
    if (this.attempts < this.config.maxAttempts) {
      await this.$client.$actionHandler.handleActions(this.actions);
      await this.startReprompt();
      this.attempts++;
    } else {
      return this.onInputEnd();
    }
  }

  async onInputEnd() {
    this.$client.$audioRecorder.off(AudioRecorderEvent.Stop, this.endFn);
    this.$client.$audioRecorder.off(AudioRecorderEvent.Timeout, this.timeoutFn);
    this.actions = [];
    this.attempts = 0;
  }

  private async startReprompt() {
    // start input recording and add event listeners
    // TODO refactor, just experimental (doesn't work with SpeechRecognizer)
    if (!this.hasAddedEvents) {
      this.$client.$audioRecorder.on(AudioRecorderEvent.Stop, this.endFn);
      this.$client.$audioRecorder.on(AudioRecorderEvent.Timeout, this.timeoutFn);
      this.hasAddedEvents = true;
    }
    return this.$client.$audioRecorder.start();
  }
}
