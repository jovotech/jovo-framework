"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AskForPermissionsConsentCard_1 = require("./AskForPermissionsConsentCard");
class AskForRemindersPermissionsCard extends AskForPermissionsConsentCard_1.AskForPermissionsConsentCard {
    constructor() {
        super();
        this.addPermission('alexa::alerts:reminders:skill:readwrite');
    }
}
exports.AskForRemindersPermissionsCard = AskForRemindersPermissionsCard;
//# sourceMappingURL=AskForRemindersPermissionsCard.js.map