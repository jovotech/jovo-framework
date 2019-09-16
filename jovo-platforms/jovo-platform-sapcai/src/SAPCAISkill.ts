import {BaseApp, Jovo, Host, SpeechBuilder, HandleRequest} from "jovo-core";
import { SAPCAIRequest } from './SAPCAIRequest';
import _get = require('lodash.get');
import _set = require('lodash.set');

import {SAPCAIResponse} from "./SAPCAIResponse";
import {SAPCAISpeechBuilder} from "./SAPCAISpeechBuilder";
import {SAPCAIUser} from "./SAPCAIUser";

export class SAPCAISkill extends Jovo {
    $sapcaiSkill: SAPCAISkill;
    // @ts-ignore
    $user: SAPCAIUser;

    constructor(app: BaseApp, host: Host, handleRequest?: HandleRequest) {
        super(app, host, handleRequest);
        this.$sapcaiSkill = this;
        this.$response = new SAPCAIResponse();
        this.$speech = new SAPCAISpeechBuilder(this);
        this.$reprompt = new SAPCAISpeechBuilder(this);
    }


    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    speechBuilder(): SAPCAISpeechBuilder {
        return this.getSpeechBuilder();
    }


    /**
     * Returns Speechbuilder object initialized for the platform
     * @public
     * @return {SpeechBuilder}
     */
    getSpeechBuilder(): SAPCAISpeechBuilder {
        return new SAPCAISpeechBuilder(this);
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
    getUserId(): string | undefined {
        // TODO
        return undefined;
    }

    /**
     * Returns device id
     * @returns {string | undefined}
     */
    getDeviceId() {
        return undefined
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
     * Returns type of platform jovo implementation
     * @public
     * @return {string}
     */
    getType() {
        return 'SAPCAISkill';
    }

    /**
     * Returns type of platform type
     * @public
     * @return {string}
     */
    getPlatformType() {
        return 'SAPCAI';
    }

    /**
     * Returns id of the touched/selected item
     * @public
     * @return {*}
     */
    getSelectedElementId() {
        // TODO
        return undefined;
    }

    /**
     * Returns raw text.
     * Only available with catchAll slots
     * @return {String} rawText
     */
    getRawText() {
        // TODO
        return undefined;
    }

}

