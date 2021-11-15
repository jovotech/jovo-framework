import { EnumLike } from '@jovotech/common';
import { Client } from '../Client';

export enum RecordingModalityType {
  Audio = 'AUDIO',
}
export type RecordingModalityTypeLike = EnumLike<RecordingModalityType>;

export interface RecordingModalityBase<TYPE extends RecordingModalityTypeLike> {
  type: TYPE;
}

export interface AudioRecordingModality
  extends RecordingModalityBase<RecordingModalityType.Audio | 'AUDIO'> {
  type: RecordingModalityType.Audio | 'AUDIO';
  useSpeechRecognition?: boolean;
}

// if more modalities are supported in the future, they have to added to this union type
export type RecordingModality = AudioRecordingModality;

export abstract class RecordingStrategy<
  TYPE extends RecordingModalityTypeLike,
  MODALITY extends RecordingModalityBase<TYPE>,
> {
  constructor(readonly client: Client) {}

  abstract readonly type: TYPE;

  abstract startRecording(modality: MODALITY): Promise<MODALITY>;
  abstract stopRecording(): void;
  abstract abortRecording(): void;
}
