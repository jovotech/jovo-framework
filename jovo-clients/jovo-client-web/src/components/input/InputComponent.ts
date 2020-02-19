import {
  AssistantEvents,
  AudioAnalyserConfig,
  AudioHelper,
  AudioProcessingPayload,
  AudioRecorder,
  AudioVisualizer,
  Component,
  ComponentConfig,
  InputEvents,
  InputRecordEvents,
  RecordMode,
  RecordModeConfig,
  SilenceDetectionConfig,
  SpeechRecognitionConfig,
} from '../..';

declare module '../../core/Interfaces' {
  interface Config {
    InputComponent: InputComponentConfig;
  }
}

export interface InputComponentConfig extends ComponentConfig {
  timeout: number;
  startThreshold: number;

  mode: RecordMode;
  modeConfig: RecordModeConfig;

  analyser: AudioAnalyserConfig;
  silenceDetection: SilenceDetectionConfig;
  speechRecognition: SpeechRecognitionConfig;
}

export class InputComponent extends Component<InputComponentConfig> {
  static DEFAULT_CONFIG: InputComponentConfig = {
    analyser: {
      fftSize: 2048,
      maxDecibels: -10,
      minDecibels: -90,
      smoothingTimeConstant: 0.85,
    },
    mode: 'default',
    modeConfig: {
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
  readonly name = 'InputComponent';

  private $recorder: AudioRecorder | null = null;
  private $visualizer: AudioVisualizer | null = null;
  private $keyPressFired = false;
  private $recognizedText = '';

  get isRecording(): boolean {
    return this.$recorder ? this.$recorder.isRecording : false;
  }

  get isPushToTalkUsed(): boolean {
    return this.$config.mode === 'push-to-talk';
  }

  get shouldLaunchFirst(): boolean {
    return this.$client.$config.launchFirst;
  }

  get pushToTalkTriggerKey(): string | number {
    return this.$config.modeConfig.triggerKey;
  }

  sendText(text: string, fromVoice = true) {
    if (this.shouldLaunchFirst && !this.$client.hasSentLaunchRequest) {
      this.$client.emit(AssistantEvents.LaunchRequest);
    } else {
      this.$client.emit(InputEvents.Text, text, fromVoice);
    }
  }

  startConversation() {
    this.$client.emit(AssistantEvents.LaunchRequest);
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

  getDefaultConfig(): InputComponentConfig {
    return InputComponent.DEFAULT_CONFIG;
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
    if (this.isPushToTalkUsed && this.$recognizedText !== '') {
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
