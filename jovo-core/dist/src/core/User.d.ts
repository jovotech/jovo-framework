import { Jovo } from './Jovo';
export declare class User {
    new: boolean;
    jovo: Jovo;
    constructor(jovo: Jovo);
    /**
     * Returns user id
     * @returns {string | undefined}
     */
    getId(): string | undefined;
    /**
     * Returns true if user is new
     * @return {boolean}
     */
    isNew(): boolean;
    /**
     * Returns true if user is new
     * @return {boolean}
     */
    isNewUser(): boolean;
    /**
     * Returns user access token
     * @returns {string | undefined}
     */
    getAccessToken(): string | undefined;
}
