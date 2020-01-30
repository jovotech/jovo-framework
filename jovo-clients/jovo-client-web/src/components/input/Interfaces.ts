export type TypedArray =
  | Int8Array
  | Uint8Array
  | Uint8ClampedArray
  | Int16Array
  | Uint16Array
  | Int32Array
  | Uint32Array
  | Float32Array
  | Float64Array;


export interface AudioProcessingPayload {
  data: Uint8Array;
  bufferLength: number;
  isEmptyBuffer?: boolean;
}

export interface AudioRecordedPayload {
  sampled: Blob;
  raw: Blob;
  forward: boolean;
}

export type RecordMode = 'default' | 'push-to-talk';

export interface RecordModeConfig {
  triggerKey: number | string;
}

export interface RecorderConfig {
  timeout?: number;
  startThreshold?: number;
  exportSampleRate?: number;

  mode?: RecordMode;
  modeConfig?: RecordModeConfig;

  analyser?: AudioAnalyserConfig;
  silenceDetection?: SilenceDetectionConfig;
  speechRecognition?: SpeechRecognitionConfig;
}

export interface AudioAnalyserConfig {
  fftSize: number;
  minDecibels: number;
  maxDecibels: number;
  smoothingTimeConstant: number;
}

export interface SpeechRecognitionConfig {
  enabled: boolean;
}

export interface SilenceDetectionConfig {
  threshold: number;
  timeout: number;
}
