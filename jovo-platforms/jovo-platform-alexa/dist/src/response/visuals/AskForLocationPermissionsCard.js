"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AskForPermissionsConsentCard_1 = require("./AskForPermissionsConsentCard");
class AskForLocationPermissionsCard extends AskForPermissionsConsentCard_1.AskForPermissionsConsentCard {
    constructor(type) {
        super();
        const validTypes = ['address', 'country_and_postal_code', 'geolocation'];
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
            if (type === 'geolocation') {
                this.setAskForGeoLocationPermission();
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
    /**
     * Sets ask for geolocation permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForGeoLocationPermission() {
        this.setPermissions(['alexa::devices:all:geolocation:read']);
        return this;
    }
}
exports.AskForLocationPermissionsCard = AskForLocationPermissionsCard;
//# sourceMappingURL=AskForLocationPermissionsCard.js.map