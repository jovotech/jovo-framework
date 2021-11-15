import _defaultsDeep from 'lodash.defaultsdeep';
import { DeepPartial, NotInitializedError, OperatingSystemDetector, VoidListener } from '..';
import { EventListenerMap, TypedEventEmitter } from '../utilities/TypedEventEmitter';

interface AudioRecorderNodes {
  inputStream?: MediaStreamAudioSourceNode;
  analyser?: AnalyserNode;
  inputGain?: GainNode;
  processor?: ScriptProcessorNode;
  destination?: AudioDestinationNode;
}

export interface AudioRecorderResult {
  data: Float32Array;
  sampleRate: number;
}

export interface AudioRecorderProcessingData {
  bufferLength: number;
  data: Uint8Array;
}

export enum AudioRecorderEvent {
  Start = 'start',
  Processing = 'processing',
  StartDetected = 'start-detected',
  SilenceDetected = 'silenced-detected',
  Timeout = 'timeout',
  Abort = 'abort',
  Stop = 'stop',
}

export interface AudioRecorderEventListenerMap extends EventListenerMap {
  [AudioRecorderEvent.Stop]: (result: AudioRecorderResult) => void;
  [AudioRecorderEvent.Processing]: (data: AudioRecorderProcessingData) => void;
  [AudioRecorderEvent.Start]: VoidListener;
  [AudioRecorderEvent.Abort]: VoidListener;
  [AudioRecorderEvent.StartDetected]: VoidListener;
  [AudioRecorderEvent.SilenceDetected]: VoidListener;
  [AudioRecorderEvent.Timeout]: VoidListener;
}

export interface AudioRecorderDetectionConfig {
  enabled: boolean;
  /** Value between 0 and 1 */
  threshold: number;
  timeoutInMs: number;
}

export interface AudioRecorderAnalyserConfig
  extends Required<Omit<AnalyserOptions, keyof AudioNodeOptions | 'fftSize'>> {
  bufferSize: number;
}

export interface AudioRecorderConfig {
  sampleRate: number;

  audioConstraints: MediaTrackConstraints;

  analyser: AudioRecorderAnalyserConfig;
  startDetection: AudioRecorderDetectionConfig;
  silenceDetection: AudioRecorderDetectionConfig;
}

export class AudioRecorder extends TypedEventEmitter<AudioRecorderEventListenerMap> {
  static getDefaultConfig(): AudioRecorderConfig {
    return {
      sampleRate: 16000,

      audioConstraints: {
        echoCancellation: true,
        noiseSuppression: true,
      },

      analyser: {
        bufferSize: 2048,
        maxDecibels: -10,
        minDecibels: -90,
        smoothingTimeConstant: 0.85,
      },
      startDetection: {
        enabled: true,
        timeoutInMs: 3000,
        threshold: 0.2,
      },
      silenceDetection: {
        enabled: true,
        timeoutInMs: 1500,
        threshold: 0.2,
      },
    };
  }
  readonly config: AudioRecorderConfig;
  private readonly audioNodes: AudioRecorderNodes = {};
  private audioContext: AudioContext | null = null;
  private mediaStream: MediaStream | null = null;
  private initialized = false;
  private recording = false;
  private recordingStartedAt?: Date;
  private startThresholdPassed = false;
  private chunks: Float32Array[] = [];
  private chunkLength = 0;

  constructor(config?: DeepPartial<AudioRecorderConfig>) {
    super();
    window.AudioContext = window.AudioContext || window.webkitAudioContext;

    const defaultConfig = AudioRecorder.getDefaultConfig();
    this.config = config ? _defaultsDeep(config, defaultConfig) : defaultConfig;
  }

  get isInitialized(): boolean {
    return this.initialized;
  }

  get isRecording(): boolean {
    return this.recording;
  }

  get startDetectionEnabled(): boolean {
    return !!(
      this.config.startDetection.enabled &&
      this.config.startDetection.threshold &&
      this.config.startDetection.timeoutInMs
    );
  }

  get silenceDetectionEnabled(): boolean {
    return !!(
      this.config.silenceDetection.enabled &&
      this.config.silenceDetection.threshold &&
      this.config.silenceDetection.timeoutInMs
    );
  }

  /**
   * Initialize the AudioRecorder. This needs to be called synchronously in a click-event handler for Safari in order to properly work.
   */
  initialize(): void {
    if (this.initialized) {
      return;
    }
    this.checkForBrowserCompatibility();

    const ctx = new AudioContext();
    this.audioNodes.inputGain = ctx.createGain();

    const analyser = ctx.createAnalyser();
    analyser.minDecibels = this.config.analyser.minDecibels;
    analyser.maxDecibels = this.config.analyser.maxDecibels;
    analyser.smoothingTimeConstant = this.config.analyser.smoothingTimeConstant;
    this.audioNodes.analyser = analyser;

    this.audioNodes.processor = ctx.createScriptProcessor();
    this.audioNodes.processor.onaudioprocess = this.doProcessing.bind(this);

    this.audioNodes.destination = ctx.destination;
    this.audioContext = ctx;

    this.initialized = true;
  }

  async start(): Promise<void> {
    this.checkForInitialization();
    if (this.recording) {
      return;
    }
    this.checkForBrowserCompatibility();

    if (OperatingSystemDetector.isWindows()) {
      if (!this.mediaStream) {
        this.mediaStream = await this.getUserMediaStream();
      }
      return this.startRecording(this.mediaStream!);
    }

    const stream = await this.getUserMediaStream();
    return this.startRecording(stream);
  }

  stop(): void {
    this.checkForInitialization();
    if (!this.recording) {
      return;
    }
    this.stopRecording();

    const data = this.mergeChunks(this.chunks, this.chunkLength);
    const result: AudioRecorderResult = {
      data,
      sampleRate: this.config.sampleRate,
    };
    this.emit(AudioRecorderEvent.Stop, result);
  }

  abort(): void {
    this.checkForInitialization();
    if (!this.recording) {
      return;
    }
    this.stopRecording();
    this.emit(AudioRecorderEvent.Abort);
  }

  private startRecording(stream: MediaStream) {
    if (!this.audioContext) {
      throw new NotInitializedError('AudioRecorder');
    }

    this.chunks = [];
    this.chunkLength = 0;
    this.startThresholdPassed = false;

    this.mediaStream = stream;

    const nodes = this.audioNodes as Required<AudioRecorderNodes>;

    nodes.inputStream = this.audioContext.createMediaStreamSource(stream);
    this.audioContext = nodes.inputStream.context as AudioContext;
    this.config.sampleRate = this.audioContext.sampleRate;

    nodes.inputStream.connect(nodes.inputGain);
    nodes.inputGain.gain.setValueAtTime(1.0, this.audioContext.currentTime);

    nodes.inputGain.connect(nodes.analyser);
    nodes.inputGain.connect(nodes.processor);

    nodes.processor.connect(nodes.destination);

    this.recordingStartedAt = new Date();
    this.recording = true;

    if (this.startDetectionEnabled) {
      this.initializeStartDetection();
    }

    this.emit(AudioRecorderEvent.Start);
  }

  private initializeStartDetection() {
    setTimeout(() => {
      if (!this.startThresholdPassed && this.startDetectionEnabled) {
        this.onTimeout();
      }
    }, this.config.startDetection.timeoutInMs);
  }

  private stopRecording() {
    this.audioNodes.processor?.disconnect();
    this.audioNodes.analyser?.disconnect();
    this.audioNodes.inputGain?.disconnect();
    this.audioNodes.inputStream?.disconnect();

    if (this.mediaStream && !OperatingSystemDetector.isWindows) {
      this.mediaStream.getTracks().forEach((track) => {
        track.stop();
      });
      this.mediaStream = null;
    }

    this.recording = false;
  }

  private onTimeout() {
    if (!this.recording) {
      return;
    }
    this.stopRecording();
    this.emit(AudioRecorderEvent.Timeout);
  }

  private doProcessing(evt: AudioProcessingEvent) {
    if (!this.recording) {
      return;
    }

    this.chunks.push(new Float32Array(evt.inputBuffer.getChannelData(0)));
    this.chunkLength += this.audioNodes.processor!.bufferSize;

    const analyser = this.audioNodes.analyser as AnalyserNode;
    analyser.fftSize = this.audioNodes.processor!.bufferSize;
    const bufferLength = analyser.frequencyBinCount;
    const data = new Uint8Array(bufferLength);

    analyser.getByteTimeDomainData(data);

    const eventData: AudioRecorderProcessingData = {
      bufferLength,
      data,
    };
    this.emit(AudioRecorderEvent.Processing, eventData);

    if (this.startDetectionEnabled && !this.startThresholdPassed) {
      return this.detectStart(bufferLength, data);
    }
    if (this.silenceDetectionEnabled && this.startThresholdPassed) {
      return this.detectSilence(bufferLength, data);
    }
  }

  private detectStart(bufferLength: number, data: Uint8Array) {
    for (let i = 0; i < bufferLength; i++) {
      const current = data[i] / 128 - 1.0;
      if (this.startThresholdPassed) {
        return;
      }
      if (
        current >= this.config.startDetection.threshold ||
        current <= -1 * this.config.startDetection.threshold
      ) {
        this.startThresholdPassed = true;
        this.emit(AudioRecorderEvent.StartDetected);
        return;
      }
    }
  }

  private detectSilence(bufferLength: number, data: Uint8Array) {
    for (let i = 0; i < bufferLength; i++) {
      // normalize
      const current = data[i] / 128 - 1.0;
      if (
        current > this.config.silenceDetection.threshold ||
        current < -1 * this.config.silenceDetection.threshold
      ) {
        this.recordingStartedAt = new Date();
      }
    }

    const newTime = new Date();
    const elapsedTime =
      newTime.getTime() - (this.recordingStartedAt?.getTime() || newTime.getTime());
    if (elapsedTime > this.config.silenceDetection.timeoutInMs) {
      this.emit(AudioRecorderEvent.SilenceDetected);
      this.stop();
    }
  }

  private mergeChunks(chunks: Float32Array[], chunkLength: number): Float32Array {
    const merged = new Float32Array(chunkLength);
    let offset = 0;
    for (const chunk of chunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }
    return merged;
  }

  private checkForInitialization() {
    if (!this.initialized) {
      throw new NotInitializedError('AudioRecorder');
    }
  }

  private checkForBrowserCompatibility() {
    // if (location.hostname !== 'localhost' && location.protocol !== 'https:') {
    //   throw new Error('Recording is only allowed on https-sites except for localhost.');
    // }
    if (!navigator || !navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error(
        '`navigator.mediaDevices.getUserMedia` is not available - recording is not supported',
      );
    }
  }

  private getUserMediaStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
      audio: this.config.audioConstraints,
    });
  }
}
