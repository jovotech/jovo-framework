import {Card} from "./Card";

export class AskForPermissionConsentCard extends Card {
    permissions: string[] = [];
    constructor() {
        super('AskForPermissionsConsent');
    }

    /**
     * Adds permission to array
     * @param {*} permission
     * @return {AskForPermissionConsentCard}
     */
    addPermission(permission: string) {
        this.permissions.push(permission);
        return this;
    }

    /**
     * Sets permission array
     * @param {array} permissions
     * @return {AskForPermissionConsentCard}
     */
    setPermissions(permissions: string[]) {
        this.permissions = permissions;
        return this;
    }
}
