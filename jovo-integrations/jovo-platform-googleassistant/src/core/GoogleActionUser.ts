import {User} from 'jovo-core';
import * as _ from "lodash";
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
        return _.get(this.googleAction.$originalRequest, 'user.profile');
    }
}
