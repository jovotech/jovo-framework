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
  sampleRate: number;
  raw: Blob;
  forward: boolean;
}

export type RecordMode = 'default' | 'push-to-talk';

export interface RecordModeConfig {
  triggerKey: number | string;
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
