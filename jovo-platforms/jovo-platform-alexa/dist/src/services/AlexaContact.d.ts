export declare class AlexaContact {
    static NAME: string;
    static GIVEN_NAME: string;
    static EMAIL: string;
    static MOBILE_NUMBER: string;
    static contactAPI(property: string, apiEndpoint: string, permissionToken: string): Promise<any>;
}
