export interface AmazonPayApiRequestOptions {
    host?: AmazonPayApiHost;
    apiAccessToken?: string;
}
declare enum AmazonPayApiHost {
    EU = "pay-api.amazon.eu",
    NA = "pay-api.amazon.com",
    JP = "pay-api.amazon.jp"
}
export interface BuyerIdResponse {
    buyerId: string;
}
export interface BuyerAddressRequestOptions extends AmazonPayApiRequestOptions {
    sandboxEmail?: string;
    sellerId: string;
    sandbox?: boolean;
}
export interface BuyerAddressResponse {
    addresses: BuyerAddress[];
}
export interface BuyerAddress {
    address: {
        addressLine1: string;
        city: string;
        countryCode: string;
        name: string;
        phone: string;
        postalCode: string;
        stateOrRegion: string;
    };
    addressType: string;
}
export declare class AmazonPayAPI {
    static getBuyerId(options: AmazonPayApiRequestOptions): Promise<BuyerIdResponse>;
    static getBuyerAddress(options: BuyerAddressRequestOptions): Promise<BuyerAddressResponse>;
    static apiCall(options: any): Promise<any>;
    /**
     * Maps the parsed Alexa API endpoint to the Amazon Pay API host.
     * There is a separate one for NA, EU (+ UK) and JP
     * @param {string} alexaApiEndpoint e.g. "https://api.amazonalexa.com"
     * @returns {string}
     */
    static mapAlexaApiEndpointToAmazonPayApiHost(alexaApiEndpoint: string): AmazonPayApiHost;
}
export {};
