import {BaseApp, Jovo, SpeechBuilder, Host} from "jovo-core";
import * as _ from 'lodash';
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

    getSpeechBuilder() {
        return new GoogleActionSpeechBuilder(this);
    }

    isNewSession(): boolean {
        return true;
    }

    ask(speech: string | SpeechBuilder, reprompt: string | SpeechBuilder | string[]) {
        delete this.$output.tell;
        this.$output.ask = {
            speech,
            reprompt
        };
        return this;
    }

    hasScreenInterface() {
        return typeof _.get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.SCREEN_OUTPUT') !== 'undefined';
    }

    hasAudioInterface() {
        return typeof _.get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.AUDIO_OUTPUT') !== 'undefined';
    }

    hasMediaResponseInterface() {
        return typeof _.get(this.$originalRequest || this.$request, 'surface.capabilities')
            .find((item: {name:string}) => item.name === 'actions.capability.MEDIA_RESPONSE_AUDIO') !== 'undefined';
    }

    hasVideoInterface() {
        return false;
    }
    getDeviceId() {
        return 'no-device-id';
    }

    getSpeechText() {
        if (!_.get(this.$response, 'richResponse.items[0].simpleResponse.ssml')) {
            return;
        }
        return _.get(this.$response, 'richResponse.items[0].simpleResponse.ssml').replace(/<\/?speak\/?>/g, '');
    }
    getRepromptText() {
        if (!_.get(this.$response, 'noInputPrompts[0].ssml')) {
            return;
        }
        return _.get(this.$response, 'noInputPrompts[0].ssml').replace(/<\/?speak\/?>/g, '');
    }
    getType() {
        return 'GoogleAction';
    }

    getRawText() {
        return '';
    }

}
