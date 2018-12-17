import {User, Jovo} from 'jovo-core';

export class DialogflowUser extends User {

    constructor(jovo: Jovo) {
        super(jovo);
    }

    getId(): string {
        return 'TemporaryDialogflowUserId';
    }
}
