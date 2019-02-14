import {BaseApp, Jovo, SpeechBuilder, Host} from "jovo-core";
import _get = require('lodash.get');

import {GoogleActionUser} from "./GoogleActionUser";
import {GoogleActionSpeechBuilder} from "./GoogleActionSpeechBuilder";
import {GoogleActionRequest} from "./GoogleActionRequest";


export class GoogleAction extends Jovo {
    $user: GoogleActionUser;
    $originalRequest: any; // tslint:disable-line
    platformRequest: any; // tslint:disable-line

    constructor(app: BaseApp, host: Host) {
        super(app, host);
        this.$user = new GoogleActionUser(this);
        this.$googleAction = this;
        this.platformRequest = GoogleActionRequest;
        this.$speech = new GoogleActionSpeechBuilder(this);
        this.$reprompt = new GoogleActionSpeechBuilder(this);
    }


    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @return {string}
     */
    getLocale(): string {
        return this.$request!.getLocale();
    }

    /**
     * Returns timestamp of a user's request
     * @return {string | undefined}
     */
    getTimestamp() {
        return this.$request!.getTimestamp();
    }

    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): GoogleActionSpeechBuilder {
        return this.getSpeechBuilder();
    }


    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): GoogleActionSpeechBuilder {
        return new GoogleActionSpeechBuilder(this);
    }


    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession(): boolean {
        return this.$request!.isNewSession();
    }


    /**
     * Says speech and waits for answer from user.
     * Reprompt when user input fails.
     * Keeps session open.
     * @public
     * @param {string|SpeechBuilder} speech
     * @param {string|SpeechBuilder|Array<SpeechBuilder>|Array<string>} reprompt
     */
    ask(speech: string | SpeechBuilder, reprompt: string | SpeechBuilder | string[]) {
        delete this.$output.tell;

        if (!reprompt) {
            reprompt = speech;
        }

        this.$output.ask = {
            speech: speech.toString(),
            reprompt: Array.isArray(reprompt) ? reprompt : reprompt.toString(),
        };
        return this;
    }


    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.SCREEN_OUTPUT') !== 'undefined';
    }


    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.AUDIO_OUTPUT') !== 'undefined';
    }


    /**
     * Returns media response capability of request device
     * @public
     * @return {boolean}
     */
    hasMediaResponseInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO') !== 'undefined';
    }


    /**
     * Returns video capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface() {
        return false;
    }


    /**
     * Google Assistant doesn't return a device id
     * @return {string | undefined}
     */
    getDeviceId() {
        return undefined;
    }

    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    getType() {
        return 'GoogleAction';
    }

    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType() {
        return 'GoogleAssistant';
    }

    /**
     * Returns raw text of request.
     * @return {string | undefined}
     */
    getRawText() {
        return _get(this.$originalRequest || this.$request, 'inputs[0].arguments[0].rawText') ||
            _get(this.$originalRequest || this.$request, 'inputs[0].rawInputs[0].query');
    }


    isInSandbox() {
        return _get(this.$originalRequest || this.$request, 'isInSandbox', false);
    }

    /**
     * Returns true if user is not voice matched
     * @return {string}
     */
    isVoiceMatchedUser() {
        // TODO
        // return _.isNumber(parseInt(this.getUserId()));
    }


}
