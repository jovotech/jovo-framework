import { Jovo, BaseApp, Host, HandleRequest, AudioData } from 'jovo-core';
import { AutopilotSpeechBuilder } from './AutopilotSpeechBuilder';
import { AutopilotUser } from './AutopilotUser';
export declare class AutopilotBot extends Jovo {
    $autopilotBot: AutopilotBot;
    $user: AutopilotUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    isNewSession(): boolean;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    getSpeechBuilder(): AutopilotSpeechBuilder;
    speechBuilder(): AutopilotSpeechBuilder;
    getDeviceId(): undefined;
    getRawText(): string;
    getTimestamp(): string;
    getLocale(): string;
    getType(): string;
    getPlatformType(): string;
    getSelectedElementId(): undefined;
    setActions(actions: object[]): this;
    getAudioData(): AudioData | undefined;
}
