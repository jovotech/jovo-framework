"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AskForPermissionsConsentCard_1 = require("./AskForPermissionsConsentCard");
class AskForListPermissionsCard extends AskForPermissionsConsentCard_1.AskForPermissionsConsentCard {
    constructor(types) {
        super();
        if (types) {
            const validTypes = ['read', 'write'];
            for (const type of types) {
                if (!validTypes.includes(type)) {
                    throw new Error('Invalid permission type');
                }
                if (type === 'read') {
                    this.addReadPermission();
                }
                if (type === 'write') {
                    this.addWritePermission();
                }
            }
        }
    }
    /**
     * Adds read permission
     * @return {AskForListPermissionsCard}
     */
    addReadPermission() {
        this.addPermission('read::alexa:household:list');
        return this;
    }
    /**
     * Adds write permission
     * @return {AskForListPermissionsCard}
     */
    addWritePermission() {
        this.addPermission('write::alexa:household:list');
        return this;
    }
    /**
     * Adds read and write permission
     * @return {AskForListPermissionsCard}
     */
    addFullPermission() {
        this.addReadPermission();
        this.addWritePermission();
        return this;
    }
}
exports.AskForListPermissionsCard = AskForListPermissionsCard;
//# sourceMappingURL=AskForListPermissionsCard.js.map