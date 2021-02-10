import { Card } from './Card';
export declare class AskForPermissionsConsentCard extends Card {
    permissions: string[];
    constructor();
    /**
     * Adds permission to array
     * @param {*} permission
     * @return {AskForPermissionsConsentCard}
     */
    addPermission(permission: string): this;
    /**
     * Sets permission array
     * @param {array} permissions
     * @return {AskForPermissionsConsentCard}
     */
    setPermissions(permissions: string[]): this;
}
