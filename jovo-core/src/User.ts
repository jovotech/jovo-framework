import {Jovo} from "./Jovo";

export class User {
    new = true;
    jovo: Jovo;

    constructor(jovo: Jovo) {
        this.jovo = jovo;
    }

    /**
     * Returns user id
     * @returns {string | undefined}
     */
    getId(): string | undefined{
        return undefined;
    }

    isNew(): boolean {
        return this.new;
    }

    /**
     * Returns user access token
     * @returns {string | undefined}
     */
    getAccessToken(): string | undefined {
        return undefined;
    }
}
