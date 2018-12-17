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
    speechBuilder(): GoogleActionSpeechBuilder {
        return this.getSpeechBuilder();
    }
    getSpeechBuilder(): GoogleActionSpeechBuilder {
        return new GoogleActionSpeechBuilder(this);
    }

    isNewSession(): boolean {
        return this.$request!.isNewSession();
    }

    ask(speech: string | SpeechBuilder, reprompt: string | SpeechBuilder | string) {
        delete this.$output.tell;

        if (!reprompt) {
            reprompt = speech;
        }

        this.$output.ask = {
            speech: speech.toString(),
            reprompt: reprompt.toString()
        };
        return this;
    }

    hasScreenInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.SCREEN_OUTPUT') !== 'undefined';
    }

    hasAudioInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.AUDIO_OUTPUT') !== 'undefined';
    }

    hasMediaResponseInterface() {
        if (!_get(this.$originalRequest || this.$request, 'surface.capabilities')) {
            return false;
        }
        return typeof _get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO') !== 'undefined';
    }

    hasVideoInterface() {
        return false;
    }
    getDeviceId() {
        return 'no-device-id';
    }

    getSpeechText() {
        if (!_get(this.$response, 'richResponse.items[0].simpleResponse.ssml')) {
            return;
        }
        return _get(this.$response, 'richResponse.items[0].simpleResponse.ssml').replace(/<\/?speak\/?>/g, '');
    }
    getRepromptText() {
        if (!_get(this.$response, 'noInputPrompts[0].ssml')) {
            return;
        }
        return _get(this.$response, 'noInputPrompts[0].ssml').replace(/<\/?speak\/?>/g, '');
    }
    getType() {
        return 'GoogleAction';
    }

    getRawText() {
        return '';
    }

}
