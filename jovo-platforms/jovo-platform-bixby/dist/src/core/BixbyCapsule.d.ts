import { Jovo, BaseApp, Host, HandleRequest, AudioData } from 'jovo-core';
import { BixbySpeechBuilder } from './BixbySpeechBuilder';
import { BixbyUser } from '../modules/BixbyUser';
import { BixbyAudioPlayer } from '../modules/BixbyAudioPlayer';
export declare class BixbyCapsule extends Jovo {
    $bixbyCapsule: BixbyCapsule;
    $audioPlayer?: BixbyAudioPlayer;
    $layout: {
        [key: string]: any;
    };
    $user: BixbyUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    speechBuilder(): BixbySpeechBuilder;
    getSpeechBuilder(): BixbySpeechBuilder;
    isNewSession(): boolean;
    getTimestamp(): string;
    getLocale(): string;
    getUserId(): string;
    addLayoutAttribute(key: string, value: any): void;
    getDeviceId(): undefined;
    hasAudioInterface(): boolean;
    hasScreenInterface(): boolean;
    hasVideoInterface(): boolean;
    getType(): string;
    getPlatformType(): string;
    getSelectedElementId(): undefined;
    getRawText(): undefined;
    getAudioData(): AudioData | undefined;
}
