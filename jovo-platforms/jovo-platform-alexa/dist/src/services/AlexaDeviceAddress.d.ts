export interface DeviceAddress {
    countryCode: string;
    postalCode: string;
}
export interface AlexaDeviceAddressPostalAndCountry extends DeviceAddress {
}
export interface AlexaDeviceAddressFull extends DeviceAddress {
    addressLine1: string;
    addressLine2: string;
    addressLine3: string;
    districtOrCounty: string;
    stateOrRegion: string;
    city: string;
}
export declare class AlexaDeviceAddress {
    static ADDRESS: string;
    static COUNTRY_AND_POSTAL_CODE: string;
    static deviceAddressApi(property: string, apiEndpoint: string, apiAccessToken: string, deviceId: string): Promise<any>;
}
