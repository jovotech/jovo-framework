"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaAPI_1 = require("../../src/services/AlexaAPI");
const AlexaSettings_1 = require("../../src/services/AlexaSettings");
const ApiError_1 = require("../../src/services/ApiError");
jest.mock('../../src/services/AlexaAPI');
process.env.NODE_ENV = 'TEST';
test('test 403 ERROR', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.reject(new Error());
    });
    const result = AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.TEMPERATURE_UNITS, 'apiEndPoint', 'permissionToken', 'deviceId');
    expect(result).rejects.toThrow('Something went wrong.');
    try {
        await result;
    }
    catch (e) {
        expect(e.code).toBe(ApiError_1.ApiError.ERROR);
    }
});
test('test Timezone', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: 'Europe/Berlin',
        });
    });
    expect(AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.TIMEZONE, 'apiEndPoint', 'permissionToken', 'deviceId')).resolves.toBe('Europe/Berlin');
});
test('test Distance Units', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: 'METRIC',
        });
    });
    expect(AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.DISTANCE_UNITS, 'apiEndPoint', 'permissionToken', 'deviceId')).resolves.toBe('METRIC');
});
test('test Temperature Units', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: 'CELSIUS',
        });
    });
    expect(AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.TEMPERATURE_UNITS, 'apiEndPoint', 'permissionToken', 'deviceId')).resolves.toBe('CELSIUS');
});
test('test undefined permissionToken', async () => {
    const token = undefined;
    expect(
    // @ts-ignore
    AlexaSettings_1.AlexaSettings.settingsAPI(AlexaSettings_1.AlexaSettings.TEMPERATURE_UNITS, 'apiEndPoint', token, 'deviceId')).rejects.toThrow('No permissionToken was found in that request');
});
test('test invalid property', async () => {
    expect(AlexaSettings_1.AlexaSettings.settingsAPI('propertyABC', 'apiEndPoint', 'permissionToken', 'deviceId')).rejects.toThrow('propertyABC is not a valid property');
});
//# sourceMappingURL=AlexaSettings.test.js.map