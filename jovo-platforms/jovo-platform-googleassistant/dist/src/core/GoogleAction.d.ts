import { AudioData, BaseApp, HandleRequest, Host, Jovo, SpeechBuilder } from 'jovo-core';
import { GoogleActionSpeechBuilder } from './GoogleActionSpeechBuilder';
import { GoogleActionUser } from './GoogleActionUser';
declare type reprompt = string | SpeechBuilder;
export declare class GoogleAction extends Jovo {
    $user: GoogleActionUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    getLocale(): string;
    getTimestamp(): string;
    speechBuilder(): GoogleActionSpeechBuilder;
    getSpeechBuilder(): GoogleActionSpeechBuilder;
    isNewSession(): boolean;
    ask(speech: string | SpeechBuilder | string[], reprompt: string | SpeechBuilder | string[], ...reprompts: reprompt[]): this;
    hasWebBrowserInterface(): boolean;
    hasScreenInterface(): boolean;
    hasAudioInterface(): boolean;
    hasMediaResponseInterface(): boolean;
    hasInteractiveCanvasInterface(): boolean;
    getAvailableSurfaces(): any;
    hasVideoInterface(): boolean;
    getDeviceId(): undefined;
    getType(): string;
    getPlatformType(): string;
    getRawText(): any;
    getAudioData(): AudioData | undefined;
    isInSandbox(): any;
    isVerifiedUser(): boolean;
    addOutputContext(name: string, parameters: {
        [key: string]: any;
    }, lifespanCount?: number): void;
    getOutputContext(name: string): any;
    isSignInRequest(): boolean;
    isPermissionRequest(): boolean;
    isConfirmationRequest(): boolean;
    isDateTimeRequest(): boolean;
    isPlaceRequest(): boolean;
    getProjectId(): string | undefined;
}
export {};
