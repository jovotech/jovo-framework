export declare class AlexaSettings {
    static TIMEZONE: string;
    static DISTANCE_UNITS: string;
    static TEMPERATURE_UNITS: string;
    static settingsAPI(property: string, apiEndpoint: string, apiAccessToken: string, deviceId: string): Promise<any>;
}
