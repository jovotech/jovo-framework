import { Jovo, User } from 'jovo-core';
export declare class CorePlatformUser extends User {
    constructor(jovo: Jovo);
    getAccessToken(): string | undefined;
    getId(): string | undefined;
}
