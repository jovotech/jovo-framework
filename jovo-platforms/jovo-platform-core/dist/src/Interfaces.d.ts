import { AsrData, Input, NluData } from 'jovo-core';
import { Data } from './core/CorePlatformResponse';
export declare enum RequestType {
    Launch = "LAUNCH",
    Intent = "INTENT",
    TranscribedText = "TRANSCRIBED_TEXT",
    Text = "TEXT",
    Event = "EVENT",
    Audio = "AUDIO",
    End = "END",
    Error = "ERROR"
}
export declare enum DeviceType {
    Unspecified = "UNSPECIFIED",
    Audio = "AUDIO",
    Browser = "BROWSER"
}
export declare enum Capability {
    Audio = "AUDIO",
    Html = "HTML",
    Text = "TEXT"
}
export interface Request {
    id: string;
    timestamp: string;
    type: RequestType;
    body: RequestBody;
    locale?: string;
    nlu?: Nlu;
    data?: Record<string, any>;
}
export interface Nlu {
    intent?: string;
    inputs?: Record<string, Input>;
    confidence?: number;
}
export interface RequestAudioData {
    sampleRate: number;
    b64string: string;
    /** Required by all plugins that do ASR. */
    data?: Float32Array;
}
export interface RequestBody {
    audio?: RequestAudioData;
    text?: string;
    event?: Record<string, any>;
}
export interface Session {
    id: string;
    new: boolean;
    data?: Record<string, any>;
}
export interface User {
    id: string;
    accessToken?: string;
    data?: Record<string, any>;
}
export interface Device {
    id?: string;
    type: DeviceType;
    capabilities: Record<Capability, string | boolean>;
}
export interface Context {
    appId?: string;
    platform?: string;
    device: Device;
    session: Session;
    user: User;
}
export interface CorePlatformRequestJSON {
    version: string;
    type: 'jovo-platform-core' | string;
    request: Request;
    context: Context;
}
export declare enum ActionType {
    Text = "TEXT",
    Speech = "SPEECH",
    Audio = "AUDIO",
    Visual = "VISUAL",
    Processing = "PROCESSING",
    Custom = "CUSTOM",
    SequenceContainer = "SEQ_CONTAINER",
    ParallelContainer = "PAR_CONTAINER",
    QuickReply = "QUICK_REPLY"
}
export interface Action {
    name?: string;
    type: ActionType;
    delay?: number;
    [key: string]: any;
}
export interface ContainerAction extends Action {
    actions: Action[];
}
export interface SequentialAction extends ContainerAction {
    type: ActionType.SequenceContainer;
}
export interface ParallelAction extends ContainerAction {
    type: ActionType.ParallelContainer;
}
export interface TextAction extends Action {
    type: ActionType.Text;
    text: string;
}
export declare type TextActionData = Omit<TextAction, 'type'>;
export interface SpeechAction extends Action {
    type: ActionType.Speech;
    ssml?: string;
    plain?: string;
    displayText?: string;
}
export declare type SpeechActionData = Omit<SpeechAction, 'type'>;
export interface AudioTrack {
    id?: string;
    src: string;
    offsetInMs?: number;
    durationInMs?: number;
    metaData?: {
        title?: string;
        description?: string;
        coverImageUrl?: string;
        backgroundImageUrl?: string;
    };
}
export interface AudioAction extends Action {
    type: ActionType.Audio;
    tracks: AudioTrack[];
}
export declare type AudioActionData = Omit<AudioAction, 'type'>;
export declare type VisualActionType = 'BASIC_CARD' | 'IMAGE_CARD' | '';
export interface VisualAction extends Action {
    type: ActionType.Visual;
    visualType: VisualActionType;
}
export interface VisualActionBasicCard extends VisualAction {
    title: string;
    body: string;
}
export interface VisualActionImageCard extends VisualAction {
    title?: string;
    body?: string;
    imageUrl: string;
}
export declare type ProcessingActionType = 'HIDDEN' | 'TYPING' | 'SPINNER';
export interface ProcessingAction extends Action {
    type: ActionType.Processing;
    processingType: ProcessingActionType;
    durationInMs?: number;
    text?: string;
}
export declare type ProcessingActionData = Omit<ProcessingAction, 'type'>;
export interface QuickReply {
    id?: string;
    label?: string;
    url?: string;
    value: any;
}
export interface QuickReplyAction extends Action {
    type: ActionType.QuickReply;
    replies: QuickReply[];
}
export declare type QuickReplyActionData = Omit<QuickReplyAction, 'type'>;
export interface CorePlatformResponseJSON {
    version: string;
    actions: Action[];
    reprompts?: Action[];
    user?: {
        data: Data;
    };
    session: {
        end: boolean;
        data: Data;
    };
    context: {
        request: {
            asr?: AsrData;
            nlu?: NluData;
        };
    };
}
