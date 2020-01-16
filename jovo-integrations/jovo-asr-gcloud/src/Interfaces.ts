export type AudioEncoding =
  | 'ENCODING_UNSPECIFIED'
  | 'LINEAR16'
  | 'FLAC'
  | 'MULAW'
  | 'AMR'
  | 'AMR_WB'
  | 'OGG_OPUS'
  | 'SPEEX_WITH_HEADER_BYTE';

export type InteractionType =
  | 'INTERACTION_TYPE_UNSPECIFIED'
  | 'DISCUSSION'
  | 'PRESENTATION'
  | 'PHONE_CALL'
  | 'VOICEMAIL'
  | 'PROFESSIONALLY_PRODUCED'
  | 'VOICE_SEARCH'
  | 'VOICE_COMMAND'
  | 'DICTATION';

export type MicrophoneDistance =
  | 'MICROPHONE_DISTANCE_UNSPECIFIED'
  | 'NEARFIELD'
  | 'MIDFIELD'
  | 'FARFIELD';

export type OriginalMediaType = 'ORIGINAL_MEDIA_TYPE_UNSPECIFIED' | 'AUDIO' | 'VIDEO';

export type RecordingDeviceType =
  | 'RECORDING_DEVICE_TYPE_UNSPECIFIED'
  | 'SMARTPHONE'
  | 'PC'
  | 'PHONE_LINE'
  | 'VEHICLE'
  | 'OTHER_OUTDOOR_DEVICE'
  | 'OTHER_INDOOR_DEVICE';

export interface RecognitionRequest {
  config: RecognitionConfig;
  audio: RecognitionAudio;
}

export interface SpeechContext {
  phrases?: string[];
}

export interface SpeakerDiarizationConfig {
  enableSpeakerDiarization?: boolean;
  minSpeakerCount?: number;
  maxSpeakerCount?: number;
}

export interface RecognitionMetadata {
  interactionType: InteractionType;
  industryNaicsCodeOfAudio: number;
  microphoneDistance: MicrophoneDistance;
  originalMediaType: OriginalMediaType;
  recordingDeviceType: RecordingDeviceType;
  recordingDeviceName: string;
  originalMimeType: string;
  obfuscatedId: string;
  audioTopic: string;
}

export interface RecognitionConfig {
  encoding?: AudioEncoding;
  sampleRateHertz?: number;
  audioChannelCount?: number;
  enableSeparateRecognitionPerChannel?: boolean;
  languageCode: string;
  maxAlternatives?: number;
  profanityFilter?: boolean;
  speechContexts?: SpeechContext[];
  enableWordTimeOffsets?: boolean;
  enableAutomaticPunctuation?: boolean;
  diarizationConfig?: SpeakerDiarizationConfig;
  metadata?: RecognitionMetadata;
  model?: 'command_and_search' | 'phone_call' | 'video' | 'default';
  useEnhanced?: boolean;
}

export type RecognitionAudio = { content: string } | { uri: string };

export interface WordInfo {
  startTime: string;
  endTime: string;
  word: string;
  speakerTag: number;
}

export interface RecognitionAlternative {
  transcript: string;
  confidence: number;
  words: WordInfo[];
}

export interface RecognitionResult {
  alternatives: RecognitionAlternative[];
  channelTag: number;
}

export interface RecognitionResponse {
  results: RecognitionResult[];
}
