import {User} from 'jovo-core';
import _get = require('lodash.get');

import {GoogleAction} from "./GoogleAction";

export interface UserProfile {
    displayName: string;
    givenName: string;
    familyName: string;
}

export class GoogleActionUser extends User {
    googleAction: GoogleAction;

    constructor(googleAction: GoogleAction) {
        super(googleAction);
        this.googleAction = googleAction;
    }

    getId(): string {
        return this.googleAction.$request!.getUserId();
    }

    getProfile(): UserProfile {
        return _get(this.googleAction.$originalRequest, 'user.profile');
    }
}
