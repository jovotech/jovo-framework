export interface AudioProcessingPayload {
  data: Uint8Array;
  bufferLength: number;
  isEmptyBuffer?: boolean;
}

export interface AudioRecordedPayload {
  sampleRate: number;
  data: Float32Array;
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
