/// <reference types="node" />
import { EventEmitter } from 'events';
import { AudioData, Cms, QuickReply, SessionData, SpeechBuilder, Validator } from '..';
import { Host, Inputs, JovoData, JovoRequest, JovoResponse, JovoSession, Output, RequestType, SessionAttributes } from '../Interfaces';
import { AsrData } from './AsrData';
import { BaseApp, BaseAppConfig } from './BaseApp';
import { HandleRequest } from './HandleRequest';
import { NluData } from './NluData';
import { User } from './User';
export declare abstract class Jovo extends EventEmitter {
    readonly $host: Host;
    readonly $app: BaseApp;
    readonly $data: JovoData;
    readonly $config: BaseAppConfig;
    $type: RequestType;
    $handleRequest?: HandleRequest;
    $jovo: Jovo;
    $user: User;
    $asr: AsrData;
    $nlu: NluData;
    $inputs: Inputs;
    readonly $output: Output;
    $request?: JovoRequest;
    $response?: JovoResponse;
    $session: JovoSession;
    readonly $plugins?: any;
    $speech: SpeechBuilder;
    $reprompt: SpeechBuilder;
    $cms: Cms;
    $rawResponseJson?: any;
    $requestSessionAttributes: SessionAttributes;
    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest);
    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    abstract isNewSession(): boolean;
    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    abstract hasAudioInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    abstract hasScreenInterface(): boolean;
    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    abstract hasVideoInterface(): boolean;
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    abstract getSpeechBuilder(): SpeechBuilder | undefined;
    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    abstract speechBuilder(): SpeechBuilder | undefined;
    /**
     * Returns device id. Doesn't work with all platforms.
     * @returns {string | undefined}
     */
    abstract getDeviceId(): string | undefined;
    /**
     * Returns raw text of request. Doesn't work with all platforms.
     * @returns {string | undefined}
     */
    abstract getRawText(): string | undefined;
    /**
     * Returns audio data of request. Doesn't work with all platforms.
     * @returns {AudioData | undefined}
     */
    abstract getAudioData(): AudioData | undefined;
    /**
     * Returns timestamp of a user's request
     * @returns {string | undefined}
     */
    abstract getTimestamp(): string | undefined;
    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @returns {string}
     */
    abstract getLocale(): string | undefined;
    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    abstract getType(): string | undefined;
    /**
     * Returns type of platform e.g. ("Alexa","GoogleAssistant")
     * @public
     * @return {string}
     */
    abstract getPlatformType(): string;
    /**
     * Returs id of the touched/selected item
     * @public
     * @return {*}
     */
    abstract getSelectedElementId(): string | undefined;
    /**
     * Returns UserID
     * @deprecated Use this.$user.getId() instead.
     * @public
     * @return {string}
     */
    getUserId(): string | undefined;
    /**
     * Returns state value stored in the request session
     * @return {string}
     */
    getState(): any;
    /**
     * Saves state to sessionAttributes
     * @param {String} state
     * @return {Jovo}
     */
    setState(state: string | undefined): this;
    /**
     * Removes state from session
     * @return {Jovo}
     */
    removeState(): this;
    /**
     * Returns session data value for given path
     * @param {string=} path
     * @return {any}
     */
    getSessionData(path?: string): any;
    /**
     * Returns session attribute value for given path
     * @param {string} path
     * @return {any}
     */
    getSessionAttribute(path: string): any;
    /**
     * Returns full session attributes obj
     * @return {any}
     */
    getSessionAttributes(): SessionData | undefined;
    /**
     * Sets session data for given path
     * @param {SessionData} obj
     * @returns {this}
     */
    setSessionData(obj: SessionData): this;
    setSessionData(path: string, value: any): this;
    /**
     * Sets session attribute for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    setSessionAttribute(path: string, value: any): this;
    /**
     * Adds session data object for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    addSessionData(path: string, value: any): this;
    /**
     * Adds session attribute for given path
     * @param {string} path
     * @param {any} value
     * @return {Jovo} this
     */
    addSessionAttribute(path: string, value: any): this;
    /**
     * Sets full session attributes obj
     * @public
     * @param {any} sessionData
     * @return {Jovo} this
     */
    setSessionAttributes(sessionData: SessionData): this;
    /**
     * Returns access token
     * @deprecated use this.$request.getAccessToken() instead
     * @returns {string}
     */
    getAccessToken(): string | undefined;
    /**
     * Returns request intent name
     * @deprecated use this.$request.getIntentName() instead
     * @returns {string}
     */
    getIntentName(): string | undefined;
    /**
     * Responds with the given text and ends session
     * Transforms plaintext to SSML
     * @public
     * @param {string|SpeechBuilder|string[]} speech Plaintext or SSML
     */
    tell(speech: string | SpeechBuilder | string[]): Jovo;
    /**
     * Says speech and waits for answer from user.
     * Reprompt when user input fails.
     * Keeps session open.
     * @public
     * @param {string|SpeechBuilder} speech
     * @param {string|SpeechBuilder|Array<SpeechBuilder>|Array<string>} reprompt
     */
    ask(speech: string | SpeechBuilder | string[], reprompt?: string | SpeechBuilder | string[]): this;
    showQuickReplies(quickReplies: Array<QuickReply | string>): this;
    /**
     * Maps incoming request input key names with
     * keys from the inputMap
     * @param {*} inputMap
     */
    mapInputs(inputMap: {
        [key: string]: string;
    }): void;
    /**
     * Get input object by name
     * @public
     * @param {string} key
     * @return {*}
     */
    getInput(key: string): import("..").Input;
    /**
     * Sets output object
     * @public
     * @param {Output} obj
     * @return {Jovo}
     */
    setOutput(obj: Output): this;
    /**
     * Set raw json response.
     * @param obj
     */
    setResponseObject(obj: any): void;
    /**
     * Shows simple card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @return {Jovo}
     */
    showSimpleCard(title: string, content: string): this;
    /**
     * Shows image card to response
     * @public
     * @param {string} title
     * @param {string} content
     * @param {string} imageUrl secure url
     * @return {Jovo}
     */
    showImageCard(title: string, content: string, imageUrl: string): this;
    /**
     * Shows account linking card to response
     * @public
     * @return {Jovo}
     */
    showAccountLinkingCard(): this;
    /**
     * Fires respond event and ends session.
     * @deprecated
     * @public
     */
    endSession(): void;
    /**
     * Returns true if the current request is of type LAUNCH
     * @public
     * @return {boolean}
     */
    isLaunchRequest(): boolean;
    /**
     * Returns true if the current request is of type INTENT
     * @public
     * @return {boolean}
     */
    isIntentRequest(): boolean;
    /**
     * Returns true if the current request is of type END
     * @public
     * @return {boolean}
     */
    isEndRequest(): boolean;
    /**
     * Returns true if the current request is of type AUDIOPLAYER
     * @public
     * @return {boolean}
     */
    isAudioPlayerRequest(): boolean;
    /**
     * Returns true if the current request is of type ON_ELEMENT_SELECTED
     * @public
     * @return {boolean}
     */
    isElementSelectedRequest(): boolean;
    /**
     * Validates incoming request input data for all registered validators asynchronous.
     * @param schema The object containing all validators of type Validator|Function.
     * @returns object Contains function failed() to filter for failed validators.
     */
    validateAsync(schema: {
        [key: string]: any;
    }): Promise<{
        failed(...args: string[]): boolean;
    }>;
    /**
     * Validates incoming request input data for all registered validators.
     * @param schema The object containing all validators of type Validator|Function.
     * @returns object Contains function failed() to filter for failed validators.
     */
    validate(schema: {
        [key: string]: any;
    }): {
        failed(...args: string[]): boolean;
    };
    /**
     * Reduces all failed validators to a set applying to the filter in ...args.
     * @param failedValidators An array of all failed validators.
     * @returns object Contains a function to filter through all failed validators.
     */
    parseForFailedValidators(failedValidators: string[][]): {
        failed(...args: string[]): boolean;
    };
    /**
     * Helper function for this.validate().
     * @param validator The current Validator to call the current request input data on.
     * @param inputName The current input data name to validate.
     * @param input The current input data to validate.
     * @param failedValidators An array of already failed validators.
     * @throws JovoError if the validator has an unsupported type.
     */
    parseForValidator(validator: () => void | Validator, inputName: string, input: any, failedValidators: string[][]): void;
    /**
     * Asynchronous helper function for this.validateAsync().
     * @param validator The current Validator to call the current request input data on.
     * @param inputName The current input data name to validate.
     * @param input The current input data to validate.
     * @param failedValidators An array of already failed validators.
     * @throws JovoError if the validator has an unsupported type.
     */
    parseForValidatorAsync(validator: () => void | Validator, inputName: string, input: any, failedValidators: string[][]): Promise<void>;
    isJovoDebuggerRequest(): boolean;
}
