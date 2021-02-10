import { BaseApp, HandleRequest, Host, Jovo } from 'jovo-core';
import { BaseResponse, ResponseOptions, Suggestion } from '../Interfaces';
import { GoogleBusinessSpeechBuilder } from './GoogleBusinessSpeechBuilder';
import { GoogleBusinessUser } from './GoogleBusinessUser';
export declare class GoogleBusinessBot extends Jovo {
    $googleBusinessBot: GoogleBusinessBot;
    $user: GoogleBusinessUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    isNewSession(): boolean;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    getSpeechBuilder(): GoogleBusinessSpeechBuilder;
    speechBuilder(): GoogleBusinessSpeechBuilder;
    getDeviceId(): string | undefined;
    getRawText(): string | undefined;
    getAudioData(): undefined;
    getTimestamp(): string | undefined;
    getLocale(): string | undefined;
    getType(): string | undefined;
    getPlatformType(): string;
    getSelectedElementId(): string | undefined;
    addSuggestionChips(suggestions: Suggestion[]): this;
    setFallback(fallback: string): this;
    showText(text: string, options?: ResponseOptions): Promise<void>;
    makeBaseResponse(): BaseResponse;
    private get serviceAccount();
}
