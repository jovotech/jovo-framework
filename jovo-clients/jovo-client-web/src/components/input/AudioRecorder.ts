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
    webkitAudioContext?: new () => AudioContext;
  }
}

interface AudioRecorderNodes {
  inputStream?: MediaStreamAudioSourceNode;
  analyser?: AnalyserNode;
  inputGain?: GainNode;
  processor?: ScriptProcessorNode;
  destination?: AudioDestinationNode;
}

export class AudioRecorder {
  get inputConfig(): InputComponentConfig {
    return this.$client.$config.InputComponent;
  }

  get locale(): string {
    return this.$client.$config.locale;
  }

  get speechRecognitionEnabled(): boolean {
    return this.inputConfig.speechRecognition.enabled;
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

  private $audioCtx: AudioContext | null;
  private readonly $audioNodes: AudioRecorderNodes;
  private $audioStream: MediaStream | null;

  private readonly $recognition: SpeechRecognition | null;
  private $sampleRate: number = 16000;
  private $start: Date = new Date();
  private $chunks: Float32Array[] = [];
  private $chunkLength = 0;
  private $recording = false;
  private $speechRecognized = false;
  private $startThresholdPassed = false;

  constructor(private readonly $client: JovoWebClient) {
    window.AudioContext = window.AudioContext || window.webkitAudioContext;
    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    this.$audioCtx = null;
    this.$audioNodes = {};
    this.$audioStream = null;
    this.$recognition = null;

    if (window.SpeechRecognition && this.speechRecognitionEnabled) {
      this.$recognition = new window.SpeechRecognition();
      this.setupSpeechRecognition();
    }

    this.$client.on(RequestEvents.Data, () => {
      this.abort();
    });
  }

  init() {
    if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('The device or browser does not support recording audio!');
    }

    const ctx = new AudioContext();
    this.$audioNodes.inputGain = ctx.createGain();

    const analyser = ctx.createAnalyser();
    analyser.minDecibels = this.minDecibels;
    analyser.maxDecibels = this.maxDecibels;
    analyser.smoothingTimeConstant = this.smoothingConstant;
    this.$audioNodes.analyser = analyser;

    this.$audioNodes.processor = ctx.createScriptProcessor();
    this.$audioNodes.processor.onaudioprocess = (evt) => {
      if (this.$recording) {
        this.$chunks.push(new Float32Array(evt.inputBuffer.getChannelData(0)));
        this.$chunkLength += this.$audioNodes.processor!.bufferSize;
        this.doProcessing(this.$audioNodes.processor!.bufferSize);
      }
    };

    this.$audioNodes.destination = ctx.destination;
    this.$audioCtx = ctx;
  }

  start() {
    if (this.$recording) {
      return;
    }
    if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('The device or browser does not support recording audio!');
    }

    const constraints: MediaStreamConstraints = {
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
      },
    };

    return navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        this.startRecording(stream);
      })
      .catch((e) => {
        alert(e);
        throw e;
      });
  }

  stop() {
    if (!this.$recording) {
      return;
    }

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

  abort() {
    if (!this.$recording) {
      return;
    }
    this.stopRecording();
    this.$client.emit(InputRecordEvents.Aborted);
    this.$client.emit(InputRecordEvents.Stopped);
  }

  private startRecording(stream: MediaStream) {
    if (!this.$audioCtx) {
      throw new Error('The AudioRecorder has to be initialized before it can be used!');
    }

    this.$chunks = [];
    this.$chunkLength = 0;
    this.$startThresholdPassed = false;

    this.$audioStream = stream;

    const nodes = this.$audioNodes as Required<AudioRecorderNodes>;

    nodes.inputStream = this.$audioCtx.createMediaStreamSource(stream);
    this.$audioCtx = nodes.inputStream.context as AudioContext;
    this.$sampleRate = this.$audioCtx.sampleRate;

    nodes.inputStream.connect(nodes.inputGain);
    nodes.inputGain.gain.setValueAtTime(1.0, this.$audioCtx.currentTime);

    nodes.inputGain.connect(nodes.analyser);
    nodes.inputGain.connect(nodes.processor);

    nodes.processor.connect(nodes.destination);

    this.$start = new Date();
    this.$recording = true;

    if (this.$recognition) {
      this.$recognition.start();
    }

    if (!this.isPushToTalkUsed) {
      this.startTimeoutListener();
    }

    this.$client.emit(InputRecordEvents.Started);
  }

  private stopRecording() {
    this.$audioNodes.processor?.disconnect();
    this.$audioNodes.analyser?.disconnect();
    this.$audioNodes.inputGain?.disconnect();
    this.$audioNodes.inputStream?.disconnect();

    if (this.$audioStream) {
      this.$audioStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.$audioStream = null;
    }

    if (this.$recognition) {
      this.$recognition.stop();
    }

    this.$recording = false;
  }

  private onTimeout() {
    if (!this.$recording) {
      return;
    }
    this.stopRecording();
    this.$client.emit(InputRecordEvents.Timeout);
    this.$client.emit(InputRecordEvents.Stopped);
  }

  private startTimeoutListener() {
    setTimeout(() => {
      if (!this.$startThresholdPassed && !this.$speechRecognized) {
        this.onTimeout();
      }
    }, this.timeout);
  }

  private doProcessing(bufferSize: number = this.bufferSize) {
    const analyser = this.$audioNodes.analyser as AnalyserNode;
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

    recognition.onerror = (err: Event) => {
      // tslint:disable-next-line:no-console
      console.error('[REC]', err);
      // TODO logic
    };

    recognition.onstart = (event: Event) => {
      this.$speechRecognized = false;
    };
  }
}
