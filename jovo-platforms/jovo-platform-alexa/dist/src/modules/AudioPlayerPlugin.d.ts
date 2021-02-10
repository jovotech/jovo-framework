import { AlexaSkill } from '../core/AlexaSkill';
import { Alexa } from '../Alexa';
import { Plugin } from 'jovo-core';
export interface ImageSource {
    url: string;
    size?: string;
    widthPixels?: number;
    heightPixels?: number;
}
export interface MetaData {
    title?: string;
    subtitle?: string;
    art?: {
        sources: ImageSource[];
    };
    backgroundImage?: {
        sources: ImageSource[];
    };
}
export interface AudioItem {
    stream: {
        token: string;
        url: string;
        offsetInMilliseconds: number;
        expectedPreviousToken?: string;
    };
    metadata?: MetaData;
}
export declare class AudioPlayer {
    static PLAYBEHAVIOR_REPLACE_ALL: string;
    static PLAYBEHAVIOR_ENQUEUE: string;
    static PLAYBEHAVIOR_REPLACE_ENQUEUED: string;
    token?: string;
    playerActivity?: string;
    offsetInMilliseconds: number;
    expectedPreviousToken?: string;
    metaData?: MetaData;
    alexaSkill: AlexaSkill;
    constructor(alexaSkill: AlexaSkill);
    /**
     * Play audio file
     * @param {string} url
     * @param {string} token
     * @param {'ENQUEUE'|'REPLACE_ALL'|'REPLACE_ENQUEUED'} playBehavior
     * @return {Jovo}
     */
    play(url: string, token: string, playBehavior?: string): AlexaSkill;
    /**
     * Stops audio stream immediately
     * @return {Jovo}
     */
    stop(): AlexaSkill;
    /**
     * Clear que
     * @param {'CLEAR_ENQUEUED'|'CLEAR_ALL'} clearBehavior
     * @return {Jovo}
     */
    clearQueue(clearBehavior?: string): AlexaSkill;
    /**
     * Enqueues file
     * @param {string} url
     * @param {string} token
     * @return {Jovo}
     */
    enqueue(url: string, token: string): AlexaSkill;
    /**
     * Start file from beginning
     * @param {string} url
     * @param {string} token
     * @return {Jovo}
     */
    startOver(url: string, token: string): AlexaSkill;
    /**
     * Return offsetInMilliseconds
     * @return {number}
     */
    getOffsetInMilliseconds(): number;
    /**
     * Adds offset in ms to audio item
     * @param {number} offsetInMilliseconds
     * @return {AudioPlayerPlugin}
     */
    setOffsetInMilliseconds(offsetInMilliseconds: number): this;
    /**
     * Adds expectedPreviousToken to audio item
     * @link https://developer.amazon.com/public/solutions/alexa/alexa-skills-kit/docs/custom-audioplayer-interface-reference#play // eslint-disable-line no-use-before-define
     * @param {string} expectedPreviousToken
     * @return {AudioPlayerPlugin}
     */
    setExpectedPreviousToken(expectedPreviousToken: string): this;
    /**
     * Returns token
     * @return {string}
     */
    getToken(): string | undefined;
    /**
     * Sets the meta data for the track
     * @param {MetaData} metaData
     * @return {AudioPlayerPlugin}
     */
    setMetaData(metaData: MetaData): void;
    /**
     * Adds a track title to be displayed
     * @param {string} title
     * @return {AudioPlayerPlugin}
     */
    setTitle(title: string): this;
    /**
     * Adds a track subtitle to be displayed
     * @param {string} subtitle
     * @return {AudioPlayerPlugin}
     */
    setSubtitle(subtitle: string): this;
    /**
     * Adds a track image
     * @param {string} url
     * @return {AudioPlayerPlugin}
     */
    addArtwork(url: string): this;
    /**
     * Adds an image to be displayed behind the track information
     * @param {string} url
     * @return {AudioPlayerPlugin}
     */
    addBackgroundImage(url: string): this;
    /**
     * Adds an image to be displayed behind the track information
     * @deprecated Please use addBackgroundImage instead
     * @param {string} url
     * @return {AudioPlayerPlugin}
     */
    addBackground(url: string): this;
}
export declare class AudioPlayerPlugin implements Plugin {
    install(alexa: Alexa): void;
    uninstall(alexa: Alexa): void;
    type(alexaSkill: AlexaSkill): void;
    output(alexaSkill: AlexaSkill): void;
}
