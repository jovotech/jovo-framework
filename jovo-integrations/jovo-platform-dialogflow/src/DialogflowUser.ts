import {User, Jovo} from 'jovo-core';

export class DialogflowUser extends User {
    jovo: Jovo;

    constructor(jovo: Jovo) {
        super(jovo);
    }

    getId(): string {
        return 'TemporaryDialogflowUserId';
    }
}
