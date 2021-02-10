import { AudioData, BaseApp, HandleRequest, Host, Jovo } from 'jovo-core';
import { SapCaiSpeechBuilder } from './SapCaiSpeechBuilder';
import { SapCaiUser } from './SapCaiUser';
export declare class SapCaiSkill extends Jovo {
    $caiSkill: SapCaiSkill;
    $user: SapCaiUser;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): SapCaiSpeechBuilder;
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): SapCaiSpeechBuilder;
    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession(): boolean;
    /**
     * Returns timestamp of a user's request
     * @returns {string | undefined}
     */
    getTimestamp(): string;
    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @returns {string}
     */
    getLocale(): string;
    /**
     * Returns UserID
     * @deprecated Use this.$user.getId() instead.
     * @public
     * @return {string}
     */
    getUserId(): string | undefined;
    /**
     * Returns device id
     * @returns {string | undefined}
     */
    getDeviceId(): undefined;
    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface(): boolean;
    /**
     * Returns type of platform jovo implementation
     * @public
     * @return {string}
     */
    getType(): string;
    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType(): string;
    /**
     * Returns id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId(): undefined;
    /**
     * Returns raw text.
     * Only available with catchAll slots
     * @return {string | undefined}
     */
    getRawText(): undefined;
    /**
     * Returns audio data.
     * Not supported by this platform.
     * @Return {undefined}
     */
    getAudioData(): AudioData | undefined;
}
