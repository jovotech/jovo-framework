import {AskForPermissionConsentCard} from "./AskForPermissionConsentCard";


export class AskForLocationPermissionsCard extends AskForPermissionConsentCard {

    constructor(type?: string) {
        super();
        const validTypes = ['address', 'country_and_postal_code'];

        if (type) {
            if (!validTypes.includes(type)) {
                throw new Error('Invalid permission type');
            }

            if (type === 'address') {
                this.setAskForAddressPermission();
            }

            if (type === 'country_and_postal_code') {
                this.setAskForCountryAndPostalCodePermission();
            }
        }
    }
    /**
     * Sets ask for address permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForAddressPermission() {
        this.setPermissions(['read::alexa:device:all:address']);
        return this;
    }

    /**
     * Sets ask for country and postal code permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForCountryAndPostalCodePermission() {
        this.setPermissions(['read::alexa:device:all:address:country_and_postal_code']);
        return this;
    }
}
