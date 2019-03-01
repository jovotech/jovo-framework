import { Jovo} from 'jovo-core';
import {DialogflowUser} from "../../DialogflowUser";
import _get = require('lodash.get');

export class FacebookMessengerUser extends DialogflowUser {

    constructor(jovo: Jovo) {
        super(jovo);
    }

    getAccessToken(): string | undefined {
        return undefined;
    }

    getId(): string {
        return _get(this.jovo.$request, 'originalDetectIntentRequest.payload.data.sender.id');
    }
}
