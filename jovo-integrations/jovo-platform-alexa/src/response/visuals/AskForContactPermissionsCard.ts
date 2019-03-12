import {AskForPermissionsConsentCard} from "./AskForPermissionsConsentCard";


export class AskForContactPermissionsCard extends AskForPermissionsConsentCard {

    constructor(contactProperties?: string[] | string) {
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
    setAskForContactPermission(contactProperties: string[] | string) {
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
