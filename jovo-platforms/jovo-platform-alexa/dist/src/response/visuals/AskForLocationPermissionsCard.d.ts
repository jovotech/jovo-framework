import { AskForPermissionsConsentCard } from './AskForPermissionsConsentCard';
export declare class AskForLocationPermissionsCard extends AskForPermissionsConsentCard {
    constructor(type?: string);
    /**
     * Sets ask for address permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForAddressPermission(): this;
    /**
     * Sets ask for country and postal code permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForCountryAndPostalCodePermission(): this;
    /**
     * Sets ask for geolocation permission
     * @return {AskForLocationPermissionsCard}
     */
    setAskForGeoLocationPermission(): this;
}
