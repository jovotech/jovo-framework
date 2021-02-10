"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AskForPermissionsConsentCard_1 = require("./AskForPermissionsConsentCard");
class AskForContactPermissionsCard extends AskForPermissionsConsentCard_1.AskForPermissionsConsentCard {
    constructor(contactProperties) {
        super();
        if (contactProperties) {
            this.setAskForContactPermission(contactProperties);
        }
    }
    /**
     * Sets ask for contact permission
     * @param {Array<string>|string} contactProperties
     * @return {AskForContactPermissionsCard}
     */
    setAskForContactPermission(contactProperties) {
        const validTypes = ['name', 'given_name', 'mobile_number', 'email'];
        if (typeof contactProperties === 'string') {
            contactProperties = [contactProperties];
        }
        contactProperties.forEach((contactProperty) => {
            if (!validTypes.includes(contactProperty)) {
                throw new Error('Invalid permission type');
            }
            this.addPermission(`alexa::profile:${contactProperty}:read`);
        });
        return this;
    }
}
exports.AskForContactPermissionsCard = AskForContactPermissionsCard;
//# sourceMappingURL=AskForContactPermissionsCard.js.map