import {BaseApp, Jovo, Host, SpeechBuilder} from "jovo-core";
import {AlexaRequest} from "./AlexaRequest";
import _get = require('lodash.get');
import {AlexaResponse} from "./AlexaResponse";
import {AlexaAPI} from "../services/AlexaAPI";
import {AmazonProfileAPI} from "../services/AmazonProfileAPI";
import {AlexaSpeechBuilder} from "./AlexaSpeechBuilder";

export class AlexaSkill extends Jovo {
    // $user: AlexaUser;
    $alexaSkill: AlexaSkill;

    constructor(app: BaseApp, host: Host) {
        super(app, host);
        this.$alexaSkill = this;
        this.$response = new AlexaResponse();
        this.$speech = new AlexaSpeechBuilder(this);
        this.$reprompt = new AlexaSpeechBuilder(this);
    }

    speechBuilder(): AlexaSpeechBuilder {
        return this.getSpeechBuilder();
    }
    getSpeechBuilder(): AlexaSpeechBuilder {
        return new AlexaSpeechBuilder(this);
    }

    isNewSession(): boolean {
        return this.$request!.isNewSession();
    }

    /**
     * @deprecated in 3.0
     * @returns {string}
     */
    getLocale(): string {
        return this.$request!.getLocale();
    }

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

    getSpeechText() {
        const outputSpeech = this.$response!.getSpeech();

        if (!outputSpeech) {
            return;
        }
        return outputSpeech.replace(/<\/?speak\/?>/g, '');
    }

    getRepromptText() {
        const repromptSpeech = this.$response!.getReprompt();

        if (!repromptSpeech) {
            return;
        }
        return repromptSpeech.replace(/<\/?speak\/?>/g, '');
    }

    getDeviceId() {
        return _get(this.$request, 'context.System.device.deviceId');
    }

    hasAudioInterface() {
        return this.$request!.hasAudioInterface();
    }

    hasScreenInterface() {
        return this.$request!.hasScreenInterface();
    }

    hasVideoInterface() {
        return this.$request!.hasVideoInterface();
    }

    hasAPLInterface() {
        return (this.$request! as AlexaRequest).hasAPLInterface();
    }

    getType() {
        return 'AlexaSkill';
    }

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
