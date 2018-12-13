import {User} from 'jovo-core';
import _get = require('lodash.get');
import uuidv4 = require('uuid/v4');
import {GoogleAction} from "./GoogleAction";

export interface UserProfile {
    displayName: string;
    givenName: string;
    familyName: string;
}

export class GoogleActionUser extends User {
    googleAction: GoogleAction;

    $storage: any = {}; // tslint:disable-line

    constructor(googleAction: GoogleAction) {
        super(googleAction);
        this.googleAction = googleAction;
        try {
            this.$storage = JSON.parse(_get(
                googleAction.$originalRequest || googleAction.$request, 'user.userStorage'));
        } catch (e) {

        }
    }

    getId(): string {
        const userId = this.$storage.userId ||
            this.googleAction.$request!.getUserId() ||
            uuidv4();

        this.$storage.userId = userId;
        return userId;
    }

    getProfile(): UserProfile {
        return _get(this.googleAction.$originalRequest, 'user.profile');
    }
}
