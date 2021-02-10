import { AskForPermissionsConsentCard } from './AskForPermissionsConsentCard';
export declare class AskForListPermissionsCard extends AskForPermissionsConsentCard {
    constructor(types?: string[]);
    /**
     * Adds read permission
     * @return {AskForListPermissionsCard}
     */
    addReadPermission(): this;
    /**
     * Adds write permission
     * @return {AskForListPermissionsCard}
     */
    addWritePermission(): this;
    /**
     * Adds read and write permission
     * @return {AskForListPermissionsCard}
     */
    addFullPermission(): this;
}
