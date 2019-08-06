import { Jovo} from 'jovo-core';
import _get = require('lodash.get');
import {DialogflowUser} from "../../DialogflowUser";

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
