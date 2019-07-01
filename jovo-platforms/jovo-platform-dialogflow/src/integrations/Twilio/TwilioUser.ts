import { Jovo} from 'jovo-core';
import _get = require('lodash.get');
import {DialogflowUser} from "../../DialogflowUser";
import {CarrierLocation, TwilioPayload} from './interfaces';

export class TwilioUser extends DialogflowUser {

    private twilioPayload: TwilioPayload;

    constructor(jovo: Jovo) {
        super(jovo);
        this.twilioPayload = _get(jovo.$request, 'originalDetectIntentRequest.payload.data');
    }

    getAccessToken(): string | undefined {
        return undefined;
    }

    getPhoneNumber(): string {
        return this.twilioPayload.From;
    }

    getCarrierLocation(): CarrierLocation {
        return {
            city: this.twilioPayload.FromCity,
            zip: this.twilioPayload.FromZip,
            state: this.twilioPayload.FromState
        };
    }

    getTwilioPayload(): TwilioPayload {
        return this.twilioPayload;
    }
}
