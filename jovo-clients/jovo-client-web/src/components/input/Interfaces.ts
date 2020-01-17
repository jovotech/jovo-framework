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

export interface RecordModeOptions {
  triggerKey: number | string;
}

export interface RecorderOptions {
  timeout?: number;
  startThreshold?: number;
  exportSampleRate?: number;

  mode?: RecordMode;
  modeOptions?: RecordModeOptions;

  analyser?: AudioAnalyserOptions;
  silenceDetection?: SilenceDetectionOptions;
  speechRecognition?: SpeechRecognitionOptions;
}

export interface AudioAnalyserOptions {
  fftSize: number;
  minDecibels: number;
  maxDecibels: number;
  smoothingTimeConstant: number;
}

export interface SpeechRecognitionOptions {
  enabled: boolean;
}

export interface SilenceDetectionOptions {
  threshold: number;
  timeout: number;
}
