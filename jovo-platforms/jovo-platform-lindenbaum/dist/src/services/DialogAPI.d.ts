import { AxiosResponse } from 'jovo-core';
export declare class DialogAPI {
    static baseUrl: string;
    static getDialogData(options: DialogAPIRequestOptions): Promise<AxiosResponse<DialogAPIData>>;
    static deleteDialogData(options: DialogAPIRequestOptions): Promise<AxiosResponse>;
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
}
export interface SynthesisData extends Data {
    text: string;
}
export interface TranscriptionData extends Data {
    text: string;
    confidence: number;
}
export interface CustomData extends Data {
    key: string;
    value: string;
}
export interface EndData extends Data {
    reason: 'botTerminated' | 'callerTerminated' | 'callBridged' | 'callForwarded' | 'botError' | 'transcriberError' | 'synthesizerError';
}
