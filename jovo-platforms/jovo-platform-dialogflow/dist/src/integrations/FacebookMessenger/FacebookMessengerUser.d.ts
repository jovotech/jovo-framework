import { Jovo } from 'jovo-core';
import { DialogflowUser } from '../../DialogflowUser';
export declare class FacebookMessengerUser extends DialogflowUser {
    constructor(jovo: Jovo);
    getAccessToken(): string | undefined;
    getId(): string;
}
