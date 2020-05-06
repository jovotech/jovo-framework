import { HttpService, AxiosResponse } from 'jovo-core';

export class DialogAPI {
  static baseUrl = 'https://cognitivevoice.io/dialog';
  static async getDialogData(
    options: DialogAPIRequestOptions,
  ): Promise<AxiosResponse<DialogAPIData>> {
    const url = `${this.baseUrl}/dialog/${options.resellerToken}/${options.dialogId}`;

    const response = await HttpService.get(url);
    return response;
  }

  static async deleteDialogData(options: DialogAPIRequestOptions): Promise<AxiosResponse> {
    const url = `${this.baseUrl}/dialog/${options.resellerToken}/${options.dialogId}`;

    const response = await HttpService.delete(url);
    return response;
  }
}

export interface DialogAPIRequestOptions {
  dialogId: string;
  resellerToken: string;
}

export interface DialogAPIData {
  dialogId: string;
  callId: string;
  data: Data[];
}

export interface Data {
  timestamp: string;
  type: 'Start' | 'Synthesis' | 'Transcription' | 'Custom' | 'End';
}

export interface StartData extends Data {
  // same as Data
}

export interface SynthesisData extends Data {
  text: string;
}

export interface TranscriptionData extends Data {
  text: string;
  confidence: number; // 0 <= x <= 100
}

export interface CustomData extends Data {
  key: string;
  value: string;
}

export interface EndData extends Data {
  reason:
    | 'botTerminated'
    | 'callerTerminated'
    | 'callBridged'
    | 'callForwarded'
    | 'botError'
    | 'transcriberError'
    | 'synthesizerError';
}
