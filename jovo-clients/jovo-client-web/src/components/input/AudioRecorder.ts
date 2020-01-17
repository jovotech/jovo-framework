import {
  AudioEncoder,
  AudioRecordedPayload,
  InputComponentOptions,
  InputRecordEvents,
  JovoWebClient,
  RequestEvents,
  WebAssistantEvents,
} from '../..';

declare global {
  interface Window {
    webkitSpeechRecognition?: new () => SpeechRecognition;
    SpeechRecognition?: new () => SpeechRecognition;
  }
}

export class AudioRecorder {
  get inputOptions(): InputComponentOptions {
    return this.$client.options.InputComponent;
  }

  get speechRecognitionEnabled(): boolean {
    return this.inputOptions.speechRecognition.enabled;
  }

  get locale(): string {
    return this.$client.options.locale;
  }

  get minDecibels(): number {
    return this.inputOptions.analyser.minDecibels!;
  }

  get maxDecibels(): number {
    return this.inputOptions.analyser.maxDecibels!;
  }

  get smoothingConstant(): number {
    return this.inputOptions.analyser.smoothingTimeConstant!;
  }

  get bufferSize(): number {
    return this.inputOptions.analyser.fftSize!;
  }

  get startThreshold(): number {
    return this.inputOptions.startThreshold;
  }

  get timeout(): number {
    return this.inputOptions.timeout;
  }

  get silenceThreshold(): number {
    return this.inputOptions.silenceDetection.threshold;
  }

  get silenceTimeout(): number {
    return this.inputOptions.silenceDetection.timeout;
  }

  get isPushToTalkUsed(): boolean {
    return this.inputOptions.mode === 'push-to-talk';
  }

  get isRecording(): boolean {
    return this.$recording;
  }

  get shouldLaunchFirst(): boolean {
    return this.$client.options.launchFirst;
  }

  get exportSampleRate(): number {
    return this.inputOptions.exportSampleRate;
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
  private $chunks: any[] = [];
  private $chunkLength: number = 0;
  private $recording: boolean = false;
  private $speechRecognized: boolean = false;
  private $startThresholdPassed: boolean = false;

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
        this.$client.emit(WebAssistantEvents.LaunchRequest);
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

      const rawBlob = AudioEncoder.encodeToWav(
        this.$chunks,
        this.$chunkLength,
        this.$sampleRate,
        this.$sampleRate,
      );
      const sampledBlob = AudioEncoder.encodeToWav(
        this.$chunks,
        this.$chunkLength,
        this.$sampleRate,
        this.exportSampleRate,
      );

      const payload: AudioRecordedPayload = {
        forward: this.$recognition === null || (this.$recognition && !this.$speechRecognized),
        raw: rawBlob,
        sampled: sampledBlob,
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

  private doProcessing() {
    const analyser = this.$analyser;
    analyser.fftSize = this.bufferSize;
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

    const scriptNode: ScriptProcessorNode = this.$context.createScriptProcessor(
      this.bufferSize,
      1,
      1,
    );

    scriptNode.addEventListener('audioprocess', (evt: AudioProcessingEvent) => {
      if (this.$recording) {
        this.$chunks.push(new Float32Array(evt.inputBuffer.getChannelData(0)));
        this.$chunkLength += this.bufferSize;
        this.doProcessing();
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
