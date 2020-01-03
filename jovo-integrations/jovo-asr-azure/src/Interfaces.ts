export enum AzureAsrRecognitionStatus {
  Success = 'Success',
  NoMatch = 'NoMatch',
  InitialSilenceTimeout = 'InitialSilenceTimeout',
  BabbleTimeout = 'BabbleTimeout',
  Error = 'Error',
}

export interface SimpleAzureAsrResponse {
  RecognitionStatus: AzureAsrRecognitionStatus;
  DisplayText?: string;
  Offset: number;
  Duration: number;
}

export interface AzureAsrResult {
  Confidence: number;
  Lexical: string;
  ITN: string;
  MaskedITN: string;
  Display: string;
}

export interface DetailedAzureAsrResponse extends Omit<SimpleAzureAsrResponse, 'DisplayText'> {
  NBest: AzureAsrResult[];
}
