import { BaseApp, Jovo, Host, SpeechBuilder, HandleRequest, AudioData } from 'jovo-core';
export declare type SupportedIntegration = 'FacebookMessenger' | 'Slack' | 'Twilio' | 'DialogflowPhoneGateway' | 'Genesys';
export declare class DialogflowAgent extends Jovo {
    $dialogflowAgent: DialogflowAgent;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @return {string}
     */
    getLocale(): string;
    /**
     * Returns timestamp of a user's request
     * @return {string | undefined}
     */
    getTimestamp(): string;
    /**
     * Returns source of request payload
     */
    getSource(): any;
    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession(): boolean;
    /**
     * Google Assistant doesn't return a device id
     * @return {string | undefined}
     */
    getDeviceId(): string | undefined;
    /**
     * Returns raw text of request.
     * @return {string | undefined}
     */
    getRawText(): string | undefined;
    /**
     * Returns audio data of request.
     * Not supported by this platform.
     * @return {undefined}
     */
    getAudioData(): AudioData | undefined;
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): SpeechBuilder | undefined;
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): SpeechBuilder | undefined;
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
     * Returns video capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface(): boolean;
    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
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
     * Returs id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId(): string | undefined;
    setCustomPayload(platform: string, payload: object): void;
}
