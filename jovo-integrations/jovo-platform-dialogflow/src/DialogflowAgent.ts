import {BaseApp, Jovo, Host, SpeechBuilder} from "jovo-core";
import {DialogflowUser} from "./DialogflowUser";
import _get = require('lodash.get');

export class DialogflowAgent extends Jovo {

    constructor(app: BaseApp, host: Host) {
        super(app, host);
        // this.$request = DialogflowRequest.fromJSON(hostwrapper.getRequestObject()) as DialogflowRequest;
        // this.$request.requestObj = hostwrapper.getRequestObject();
        // this.$response = new DialogflowResponse();
        // this.$sessionAttributes = this.$request.getSessionAttributes();
        // this.$inputs = this.$request.getInputs();
        this.$user = new DialogflowUser(this);
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

    // dialogflowAgent(): DialogflowAgent {
    //     return this;
    // }

    /**
     * Returns boolean if request is part of new session
     * @public
     * @return {boolean}
     */
    isNewSession(): boolean {
        return true;
    }


    /**
     * Google Assistant doesn't return a device id
     * @return {string | undefined}
     */
    getDeviceId(): string | undefined {
        return undefined;
    }


    /**
     * Returns raw text of request.
     * @return {string | undefined}
     */
    getRawText(): string | undefined {
        return _get(this.$request!, 'queryResult.queryText');
    }


    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): SpeechBuilder | undefined {
        return this.getSpeechBuilder();
    }

    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): SpeechBuilder | undefined {
        return new SpeechBuilder(this);
    }


    /**
     * Returns audio capability of request device
     * @public
     * @return {boolean}
     */
    hasAudioInterface(): boolean {
        return false;
    }

    /**
     * Returns screen capability of request device
     * @public
     * @return {boolean}
     */
    hasScreenInterface(): boolean {
        return false;
    }


    /**
     * Returns video capability of request device
     * @public
     * @return {boolean}
     */
    hasVideoInterface(): boolean {
        return false;
    }

    /**
     * Returns type of platform ("AlexaSkill","GoogleAction")
     * @public
     * @return {string}
     */
    getType() {
        return 'DialogflowAgent';
    }

    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType() {
        return 'Dialogflow';
    }

    /**
     * Returs id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId(): string | undefined {
        return undefined;
    }

}
