export type SynthesisInput = { text: string } | { ssml: string };
export type SsmlGender = 'SSML_VOICE_GENDER_UNSPECIFIED' | 'MALE' | 'FEMALE' | 'NEUTRAL';
export type AudioEncoding = 'AUDIO_ENCODING_UNSPECIFIED' | 'LINEAR16' | 'MP3' | 'OGG_OPUS';

export interface VoiceSelectionParams {
  languageCode: string;
  name?: string;
  ssmlGender?: SsmlGender;
}

export interface AudioConfig {
  audioEncoding: AudioEncoding;
  speakingRate?: number;
  pitch?: number;
  volumeGainDb?: number;
  sampleRateHertz?: number;
  efectsProfileId?: string[];
}

export interface SynthesisRequest {
  input: SynthesisInput;
  voice: VoiceSelectionParams;
  audioConfig: AudioConfig;
}

export interface SynthesisResponse {
  audioContent: string;
}
