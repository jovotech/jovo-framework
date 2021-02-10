"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Card_1 = require("./Card");
class AskForPermissionsConsentCard extends Card_1.Card {
    constructor() {
        super('AskForPermissionsConsent');
        this.permissions = [];
    }
    /**
     * Adds permission to array
     * @param {*} permission
     * @return {AskForPermissionsConsentCard}
     */
    addPermission(permission) {
        this.permissions.push(permission);
        return this;
    }
    /**
     * Sets permission array
     * @param {array} permissions
     * @return {AskForPermissionsConsentCard}
     */
    setPermissions(permissions) {
        this.permissions = permissions;
        return this;
    }
}
exports.AskForPermissionsConsentCard = AskForPermissionsConsentCard;
//# sourceMappingURL=AskForPermissionsConsentCard.js.map