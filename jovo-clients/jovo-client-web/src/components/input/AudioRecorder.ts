import {
  AssistantEvents,
  AudioHelper,
  AudioRecordedPayload,
  InputComponentConfig,
  InputRecordEvents,
  JovoWebClient,
  RequestEvents,
} from '../..';

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

export class AudioRecorder {
  get inputConfig(): InputComponentConfig {
    return this.$client.$config.InputComponent;
  }

  get speechRecognitionEnabled(): boolean {
    return this.inputConfig.speechRecognition.enabled;
  }

  get locale(): string {
    return this.$client.$config.locale;
  }

  get minDecibels(): number {
    return this.inputConfig.analyser.minDecibels!;
  }

  get maxDecibels(): number {
    return this.inputConfig.analyser.maxDecibels!;
  }

  get smoothingConstant(): number {
    return this.inputConfig.analyser.smoothingTimeConstant!;
  }

  get bufferSize(): number {
    return this.inputConfig.analyser.fftSize!;
  }

  get startThreshold(): number {
    return this.inputConfig.startThreshold;
  }

  get timeout(): number {
    return this.inputConfig.timeout;
  }

  get silenceThreshold(): number {
    return this.inputConfig.silenceDetection.threshold;
  }

  get silenceTimeout(): number {
    return this.inputConfig.silenceDetection.timeout;
  }

  get isPushToTalkUsed(): boolean {
    return this.inputConfig.mode === 'push-to-talk';
  }

  get isRecording(): boolean {
    return this.$recording;
  }

  get shouldLaunchFirst(): boolean {
    return this.$client.$config.launchFirst;
  }

  static new(client: JovoWebClient): Promise<AudioRecorder> {
    return new Promise<AudioRecorder>(async (resolve, reject) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        resolve(new AudioRecorder(stream, client));
      } catch (e) {
        reject(e);
      }
    });
  }
  private readonly $context: AudioContext;
  private readonly $source: MediaStreamAudioSourceNode;
  private readonly $analyser: AnalyserNode;
  private readonly $recognition: SpeechRecognition | null;
  private readonly $sampleRate: number;
  private $recorder: ScriptProcessorNode | null;
  private $start: Date = new Date();
  private $chunks: Float32Array[] = [];
  private $chunkLength = 0;
  private $recording = false;
  private $speechRecognized = false;
  private $startThresholdPassed = false;

  private constructor(stream: MediaStream, private readonly $client: JovoWebClient) {
    const context = new AudioContext();
    const sourceNode: MediaStreamAudioSourceNode = context.createMediaStreamSource(stream);

    const analyser = sourceNode.context.createAnalyser();
    analyser.minDecibels = this.minDecibels;
    analyser.maxDecibels = this.maxDecibels;
    analyser.smoothingTimeConstant = this.smoothingConstant;

    sourceNode.connect(analyser);

    this.$context = context;
    this.$source = sourceNode;
    this.$analyser = analyser;
    this.$recorder = null;

    this.$sampleRate = sourceNode.context.sampleRate;

    this.$recognition = null;
    window.SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    if (window.SpeechRecognition && this.speechRecognitionEnabled) {
      this.$recognition = new window.SpeechRecognition();
      this.setupSpeechRecognition();
    }

    this.$client.on(RequestEvents.Data, () => {
      this.abort();
    });
  }

  start() {
    if (!this.$recording && !this.$recorder) {
      if (this.shouldLaunchFirst && !this.$client.hasSentLaunchRequest) {
        this.$client.emit(AssistantEvents.LaunchRequest);
      } else {
        this.setupRecorder();

        if (this.$recognition) {
          this.$recognition.start();
        }

        if (!this.isPushToTalkUsed) {
          this.startTimeoutListener();
        }

        this.$client.emit(InputRecordEvents.Started);
      }
    }
  }

  stop() {
    if (this.$recorder && this.$recording) {
      this.stopRecording();

      const data = AudioHelper.mergeChunks(this.$chunks, this.$chunkLength);
      const payload: AudioRecordedPayload = {
        forward: this.$recognition === null || (this.$recognition && !this.$speechRecognized),
        data,
        sampleRate: this.$sampleRate,
      };
      this.$client.emit(InputRecordEvents.Recorded, payload);
      this.$client.emit(InputRecordEvents.Stopped);
    }
  }

  abort() {
    if (this.$recorder && this.$recording) {
      this.stopRecording();
      this.$client.emit(InputRecordEvents.Aborted);
      this.$client.emit(InputRecordEvents.Stopped);
    }
  }

  private onTimeout() {
    if (this.$recorder && this.$recording) {
      this.stopRecording();
      this.$client.emit(InputRecordEvents.Timeout);
      this.$client.emit(InputRecordEvents.Stopped);
    }
  }

  private startTimeoutListener() {
    setTimeout(() => {
      if (!this.$startThresholdPassed && !this.$speechRecognized) {
        this.onTimeout();
      }
    }, this.timeout);
  }

  private stopRecording() {
    if (this.$recorder) {
      this.$recorder.disconnect(this.$context.destination);
      this.$source.disconnect(this.$recorder);

      if (this.$recognition) {
        this.$recognition.stop();
      }

      this.$recording = false;
      this.$recorder = null;
    }
  }

  private doProcessing(bufferSize: number = this.bufferSize) {
    const analyser = this.$analyser;
    analyser.fftSize = bufferSize;
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(data);

    this.$client.emit(InputRecordEvents.Processing, {
      bufferLength,
      data,
    });

    if (!this.isPushToTalkUsed) {
      if (this.$startThresholdPassed) {
        this.detectSilence(bufferLength, data);
      } else {
        this.detectStartThreshold(bufferLength, data);
      }
    }
  }

  private detectSilence(bufferLength: number, data: Uint8Array) {
    for (let i = 0; i < bufferLength; i++) {
      // normalize
      const current = data[i] / 128 - 1.0;
      if (current > this.silenceThreshold || current < -1 * this.silenceThreshold) {
        this.$start = new Date();
      }
    }

    const newTime = new Date();
    const elapsedTime = newTime.getTime() - this.$start.getTime();
    if (elapsedTime > this.silenceTimeout) {
      this.$client.emit(InputRecordEvents.SilenceDetected);
      this.stop();
    }
  }

  private detectStartThreshold(bufferLength: number, data: Uint8Array) {
    for (let i = 0; i < bufferLength; i++) {
      const current = data[i] / 128 - 1.0;
      if (current >= this.startThreshold || current <= -1 * this.startThreshold) {
        this.$startThresholdPassed = true;
      }
    }
  }

  private setupRecorder() {
    this.$chunks = [];
    this.$chunkLength = 0;
    this.$startThresholdPassed = false;

    const scriptNode: ScriptProcessorNode = this.$context.createScriptProcessor(0, 1, 1);

    scriptNode.addEventListener('audioprocess', (evt: AudioProcessingEvent) => {
      if (this.$recording) {
        this.$chunks.push(new Float32Array(evt.inputBuffer.getChannelData(0)));
        this.$chunkLength += scriptNode.bufferSize;
        this.doProcessing(scriptNode.bufferSize);
      }
    });

    this.$source.connect(scriptNode);
    scriptNode.connect(this.$context.destination);

    this.$recorder = scriptNode;
    this.$start = new Date();
    this.$recording = true;
  }

  private setupSpeechRecognition() {
    const recognition = this.$recognition!;
    recognition.lang = this.locale;
    // TODO: check how it should be handled for mobile devices for example. Chrome for Android does not support continous and/or interimResults
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      this.$speechRecognized = true;
      this.$client.emit(InputRecordEvents.SpeechRecognized, event);
    };

    recognition.onerror = (err: SpeechRecognitionError) => {
      // tslint:disable-next-line:no-console
      console.error('[REC]', err);
      // TODO logic
    };

    recognition.onstart = (event: Event) => {
      this.$speechRecognized = false;
    };
  }
}
