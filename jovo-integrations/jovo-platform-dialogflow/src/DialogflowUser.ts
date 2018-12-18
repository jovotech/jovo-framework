import {User, Jovo} from 'jovo-core';

export class DialogflowUser extends User {

    constructor(jovo: Jovo) {
        super(jovo);
    }

    getAccessToken(): string | undefined {
        return undefined;
    }

    getId(): string {
        return 'TemporaryDialogflowUserId';
    }
}
