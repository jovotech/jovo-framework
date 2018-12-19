import {BaseApp, Jovo, Host, SpeechBuilder} from "jovo-core";
import {AlexaRequest} from "./AlexaRequest";
import _get = require('lodash.get');
import {AlexaResponse} from "./AlexaResponse";
import {AlexaAPI} from "../services/AlexaAPI";
import {AmazonProfileAPI} from "../services/AmazonProfileAPI";
import {AlexaSpeechBuilder} from "./AlexaSpeechBuilder";
import {AlexaUser} from "./AlexaUser";

export class AlexaSkill extends Jovo {
    $alexaSkill: AlexaSkill;
    // @ts-ignore
    $user: AlexaUser;

    constructor(app: BaseApp, host: Host) {
        super(app, host);
        this.$alexaSkill = this;
        this.$response = new AlexaResponse();
        this.$speech = new AlexaSpeechBuilder(this);
        this.$reprompt = new AlexaSpeechBuilder(this);
    }


    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): AlexaSpeechBuilder {
        return this.getSpeechBuilder();
    }


    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): AlexaSpeechBuilder {
        return new AlexaSpeechBuilder(this);
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
     * Returns timestamp of a user's request
     * @returns {string | undefined}
     */
    getTimestamp() {
        return this.$request!.getTimestamp();
    }


    /**
     * Returns locale of the request
     * @deprecated use this.$request.getLocale() instead
     * @returns {string}
     */
    getLocale(): string {
        return this.$request!.getLocale();
    }


    /**
     * Returns UserID
     * @deprecated Use this.$user.getId() instead.
     * @public
     * @return {string}
     */
    getUserId(): string {
        return _get(this.$request, 'session.user.userId') || _get(this.$request, 'context.user.userId') ;
    }

    progressiveResponse(speech: string | SpeechBuilder, callback?: Function) {
        const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
        if (callback) {
            AlexaAPI.progressiveResponse(
                speech,
                alexaRequest.getRequestId(),
                alexaRequest.getApiEndpoint(),
                alexaRequest.getApiAccessToken()).then(() => callback());
        } else {
            return AlexaAPI.progressiveResponse(
                speech,
                alexaRequest.getRequestId(),
                alexaRequest.getApiEndpoint(),
                alexaRequest.getApiAccessToken());
        }
    }

    requestAmazonProfile(callback?: Function) {
        const alexaRequest: AlexaRequest = this.$request as AlexaRequest;
        if (callback) {
            AmazonProfileAPI.requestAmazonProfile(alexaRequest.getAccessToken()).then(() => callback());
        } else {
            return AmazonProfileAPI.requestAmazonProfile(alexaRequest.getAccessToken());
        }
    }
    //
    // getSpeechText() {
    //     const outputSpeech = this.$response!.getSpeech();
    //
    //     if (!outputSpeech) {
    //         return;
    //     }
    //     return outputSpeech.replace(/<\/?speak\/?>/g, '');
    // }
    //
    // getRepromptText() {
    //     const repromptSpeech = this.$response!.getReprompt();
    //
    //     if (!repromptSpeech) {
    //         return;
    //     }
    //     return repromptSpeech.replace(/<\/?speak\/?>/g, '');
    // }


    /**
     * Returns device id
     * @returns {string | undefined}
     */
    getDeviceId() {
        return _get(this.$request, 'context.System.device.deviceId');
    }


    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface() {
        return this.$request!.hasAudioInterface();
    }


    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface() {
        return this.$request!.hasScreenInterface();
    }


    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface() {
        return this.$request!.hasVideoInterface();
    }


    /**
     * Returns APL capability of request device
     * @public
     * @return {boolean}
     */
    hasAPLInterface() {
        return (this.$request! as AlexaRequest).hasAPLInterface();
    }


    /**
     * Returns geo location capability of request device
     * @public
     * @return {boolean}
     */
    hasGeoLocationInterface() {
        return (this.$request! as AlexaRequest).hasGeoLocationInterface();
    }


    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    getType() {
        return 'AlexaSkill';
    }


    /**
     * Returns id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId() {
        return _get(this.$request, 'request.token');
    }

    /**
     * Returns raw text.
     * Only available with catchAll slots
     * @return {String} rawText
     */
    getRawText() {
        if (!this.$inputs || this.$inputs.catchAll) {
            throw new Error('Only available with catchAll slot');
        }
        return _get(this, '$inputs.catchAll.value');
    }
}
