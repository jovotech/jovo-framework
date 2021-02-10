import { AskForPermissionsConsentCard } from './AskForPermissionsConsentCard';
export declare class AskForContactPermissionsCard extends AskForPermissionsConsentCard {
    constructor(contactProperties?: string[] | string);
    /**
     * Sets ask for contact permission
     * @param {Array<string>|string} contactProperties
     * @return {AskForContactPermissionsCard}
     */
    setAskForContactPermission(contactProperties: string[] | string): this;
}
