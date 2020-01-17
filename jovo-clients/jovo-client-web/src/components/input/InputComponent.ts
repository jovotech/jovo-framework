import {
  AudioAnalyserOptions,
  AudioHelper,
  AudioProcessingPayload,
  AudioRecorder,
  AudioVisualizer,
  Component,
  ComponentOptions,
  InputEvents,
  InputRecordEvents,
  RecordMode,
  RecordModeOptions,
  SilenceDetectionOptions,
  SpeechRecognitionOptions,
  WebAssistantEvents,
} from '../..';

export interface InputComponentOptions extends ComponentOptions {
  timeout: number;
  startThreshold: number;
  exportSampleRate: number;

  mode: RecordMode;
  modeOptions: RecordModeOptions;

  analyser: AudioAnalyserOptions;
  silenceDetection: SilenceDetectionOptions;
  speechRecognition: SpeechRecognitionOptions;
}

export class InputComponent extends Component<InputComponentOptions> {
  static DEFAULT_OPTIONS: InputComponentOptions = {
    analyser: {
      fftSize: 2048,
      maxDecibels: -10,
      minDecibels: -90,
      smoothingTimeConstant: 0.85,
    },
    exportSampleRate: 8000,
    mode: 'default',
    modeOptions: {
      triggerKey: '',
    },
    silenceDetection: {
      threshold: 0.2,
      timeout: 1500,
    },
    speechRecognition: {
      enabled: true,
    },
    startThreshold: 0.2,
    timeout: 3000,
  };
  private $recorder: AudioRecorder | null = null;
  private $visualizer: AudioVisualizer | null = null;
  private $keyPressFired: boolean = false;
  private $recognizedText: string = '';

  get isRecording(): boolean {
    return this.$recorder ? this.$recorder.isRecording : false;
  }

  get isPushToTalkUsed(): boolean {
    return this.options.mode === 'push-to-talk';
  }

  get shouldLaunchFirst(): boolean {
    return this.$client.options.launchFirst;
  }

  get pushToTalkTriggerKey(): string | number {
    return this.options.modeOptions.triggerKey;
  }

  sendText(text: string, fromVoice: boolean = true) {
    if (this.shouldLaunchFirst && !this.$client.hasSentLaunchRequest) {
      this.$client.emit(WebAssistantEvents.LaunchRequest);
    } else {
      this.$client.emit(InputEvents.Text, text, fromVoice);
    }
  }

  startRecording() {
    if (!this.$recorder) {
      AudioRecorder.new(this.$client).then((recorder: AudioRecorder) => {
        this.$recorder = recorder;
        this.$recorder.start();
      });
    } else {
      this.$recorder.start();
    }
  }

  stopRecording() {
    if (this.$recorder) {
      this.$recorder.stop();
    }
  }

  abortRecording() {
    if (this.$recorder) {
      this.$recorder.abort();
    }
  }

  setVisualizer(visualizer: AudioVisualizer) {
    this.$visualizer = visualizer;
  }

  async onInit(): Promise<void> {
    this.setupListeners();
    this.$client.on(InputRecordEvents.Aborted, this.onRecordingAborted.bind(this));
    this.$client.on(InputRecordEvents.Stopped, this.onRecordingStopped.bind(this));
    this.$client.on(InputRecordEvents.SpeechRecognized, this.onSpeechRecognized.bind(this));
    this.$client.on(InputRecordEvents.Processing, this.onAudioProcessing.bind(this));
  }

  async onStop(): Promise<void> {
    this.removeListeners();
    return super.onStop();
  }

  getDefaultOptions(): InputComponentOptions {
    return InputComponent.DEFAULT_OPTIONS;
  }

  // region DOM-event-related
  private setupListeners() {
    window.addEventListener('keydown', this.onKeyDown.bind(this));
    window.addEventListener('keyup', this.onKeyUp.bind(this));
  }

  private removeListeners() {
    window.removeEventListener('keydown', this.onKeyDown.bind(this));
    window.removeEventListener('keyup', this.onKeyUp.bind(this));
  }

  private onKeyUp(event: KeyboardEvent) {
    if (event.code === this.pushToTalkTriggerKey) {
      if (this.isPushToTalkUsed) {
        this.stopRecording();
      }
      this.$keyPressFired = false;
    }
  }

  private onKeyDown(event: KeyboardEvent) {
    if (!this.$keyPressFired && event.code === this.pushToTalkTriggerKey) {
      this.startRecording();
      this.$keyPressFired = true;
    }
  }

  // endregion

  private onSpeechRecognized(event: SpeechRecognitionEvent) {
    this.$recognizedText = AudioHelper.textFromSpeechRecognition(event);
  }

  private onRecordingStopped() {
    if (this.isPushToTalkUsed) {
      this.$client.emit(InputEvents.Text, this.$recognizedText);
      this.$recognizedText = '';
    }
  }

  private onRecordingAborted() {
    this.$recognizedText = '';
  }

  private onAudioProcessing(payload: AudioProcessingPayload) {
    if (this.$visualizer) {
      this.$visualizer.draw(payload);
    }
  }
}
