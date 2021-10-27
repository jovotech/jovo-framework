import { NormalizedOutputTemplate } from '@jovotech/output';
import { AudioRecorderEvent, Client, ClientEvent, SpeechRecognizerEvent } from '..';
import { RecordingModality } from './RecordingStrategy';

export interface RepromptHandlerConfig {
  enabled: boolean;
  maxAttempts: number;
}

export type RepromptType = NormalizedOutputTemplate['reprompt'];

export class RepromptProcessor {
  get config(): RepromptHandlerConfig {
    return this.client.config.output.reprompts;
  }

  static getDefaultConfig(): RepromptHandlerConfig {
    return {
      enabled: true,
      maxAttempts: 1,
    };
  }

  private reprompts: NormalizedOutputTemplate['reprompt'][] = [];
  private attempts = 0;
  private recordingModality?: RecordingModality;
  private timeoutFn = this.onInputTimeout.bind(this);
  private endFn = this.onInputEnd.bind(this);

  constructor(readonly client: Client) {}

  private get isUsingSpeechRecognition(): boolean {
    return (
      !!this.recordingModality?.useSpeechRecognition && this.client.speechRecognizer.isAvailable
    );
  }

  async processReprompts(reprompts: RepromptType[], modality?: RecordingModality): Promise<void> {
    console.log('process reprompts', modality);
    if (!this.config.enabled || !modality) {
      return;
    }
    this.attempts = 0;
    this.recordingModality = modality;
    this.reprompts = reprompts;
    return this.startRecording();
  }

  async onInputTimeout(): Promise<void> {
    // end is immediately called after timeout, therefore the event listener for that event needs to be removed.
    // Additionally all other event listeners should be removed in order to not have issues if another input-class is used in the next reprompt
    this.removeInputEventListeners();

    if (this.attempts < this.config.maxAttempts) {
      return this.handleReprompts();
    } else {
      return this.handleRepromptLimitReached();
    }
  }

  onInputEnd(): void {
    // All other event listeners should be removed in order to not have issues if another input-class is used in the next reprompt
    this.removeInputEventListeners();

    this.reprompts = [];
  }

  private async handleReprompts(): Promise<void> {
    await this.client.outputProcessor.processSequence(
      this.reprompts.map((reprompt) => ({
        message: reprompt,
      })),
    );

    await this.startRecording();
    this.attempts++;
  }

  private handleRepromptLimitReached(): void {
    this.client.emit(ClientEvent.RepromptLimitReached);
    return this.onInputEnd();
  }

  private async startRecording(): Promise<void> {
    if (!this.config.enabled || !this.recordingModality) {
      return;
    }
    this.addInputEventListeners();
    return this.client.startRecording(this.recordingModality);
  }

  private addInputEventListeners() {
    if (this.isUsingSpeechRecognition) {
      this.client.speechRecognizer.once(SpeechRecognizerEvent.Abort, this.endFn);
      this.client.speechRecognizer.once(SpeechRecognizerEvent.Stop, this.endFn);
      this.client.speechRecognizer.once(SpeechRecognizerEvent.Timeout, this.timeoutFn);
    } else {
      this.client.audioRecorder.once(AudioRecorderEvent.Abort, this.endFn);
      this.client.audioRecorder.once(AudioRecorderEvent.Stop, this.endFn);
      this.client.audioRecorder.once(AudioRecorderEvent.Timeout, this.timeoutFn);
    }
  }

  private removeInputEventListeners() {
    if (this.isUsingSpeechRecognition) {
      this.client.speechRecognizer.off(SpeechRecognizerEvent.Abort, this.endFn);
      this.client.speechRecognizer.off(SpeechRecognizerEvent.Stop, this.endFn);
      this.client.speechRecognizer.off(SpeechRecognizerEvent.Timeout, this.timeoutFn);
    } else {
      this.client.audioRecorder.off(AudioRecorderEvent.Abort, this.endFn);
      this.client.audioRecorder.off(AudioRecorderEvent.Stop, this.endFn);
      this.client.audioRecorder.off(AudioRecorderEvent.Timeout, this.timeoutFn);
    }
  }
}
