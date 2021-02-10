import { User, Jovo } from 'jovo-core';
export declare class DialogflowUser extends User {
    constructor(jovo: Jovo);
    getAccessToken(): string | undefined;
    getId(): string;
}
