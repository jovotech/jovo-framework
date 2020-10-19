import { Action, AudioRecorderEvent, Client, ClientEvent, SpeechRecognizerEvent } from '..';

export interface RepromptHandlerConfig {
  maxAttempts: number;
}

export class RepromptHandler {
  get config(): RepromptHandlerConfig {
    return this.$client.config.repromptHandler;
  }

  static getDefaultConfig(): RepromptHandlerConfig {
    return {
      maxAttempts: 1,
    };
  }

  private actions: Action[] = [];
  private attempts = 0;
  private hasAddedEvents = false;

  private useSpeechRecognition = false;

  private timeoutFn = this.onInputTimeout.bind(this);
  private endFn = this.onInputEnd.bind(this);

  constructor(readonly $client: Client) {}

  async handleReprompts(repromptActions: Action[], useSpeechRecognition: boolean) {
    this.actions = repromptActions;
    this.useSpeechRecognition = useSpeechRecognition;
    this.hasAddedEvents = false;
    return this.startReprompt();
  }

  async onInputTimeout() {
    if (this.attempts < this.config.maxAttempts) {
      this.$client.emit(ClientEvent.Reprompt, this.actions);
      await this.$client.$actionHandler.handleActions(this.actions);
      await this.startReprompt();
      this.attempts++;
    } else {
      this.$client.emit(ClientEvent.RepromptLimitReached);
      return this.onInputEnd();
    }
  }

  async onInputEnd() {
    if (this.useSpeechRecognition && this.$client.$speechRecognizer.isAvailable) {
      this.$client.$speechRecognizer.off(SpeechRecognizerEvent.Stop, this.endFn);
      this.$client.$speechRecognizer.off(SpeechRecognizerEvent.Timeout, this.timeoutFn);
    } else {
      this.$client.$audioRecorder.off(AudioRecorderEvent.Stop, this.endFn);
      this.$client.$audioRecorder.off(AudioRecorderEvent.Timeout, this.timeoutFn);
    }

    this.actions = [];
    this.attempts = 0;
  }

  private async startReprompt() {
    const useSpeechRecognition =
      this.useSpeechRecognition && this.$client.$speechRecognizer.isAvailable;

    if (!this.hasAddedEvents) {
      if (useSpeechRecognition) {
        this.$client.$speechRecognizer.on(SpeechRecognizerEvent.Stop, this.endFn);
        this.$client.$speechRecognizer.on(SpeechRecognizerEvent.Timeout, this.timeoutFn);
      } else {
        this.$client.$audioRecorder.on(AudioRecorderEvent.Stop, this.endFn);
        this.$client.$audioRecorder.on(AudioRecorderEvent.Timeout, this.timeoutFn);
      }
      this.hasAddedEvents = true;
    }

    return this.$client.startInputCapturing(useSpeechRecognition);
  }
}
