import {AskForPermissionsConsentCard} from "./AskForPermissionsConsentCard";


export class AskForRemindersPermissionsCard extends AskForPermissionsConsentCard {

    constructor() {
        super();
        this.addPermission('alexa::alerts:reminders:skill:readwrite');
    }

}
