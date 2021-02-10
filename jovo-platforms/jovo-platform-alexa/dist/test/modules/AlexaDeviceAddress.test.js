"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaAPI_1 = require("../../src/services/AlexaAPI");
const AlexaDeviceAddress_1 = require("../../src/services/AlexaDeviceAddress");
const ApiError_1 = require("../../src/services/ApiError");
jest.mock('../../src/services/AlexaAPI');
process.env.NODE_ENV = 'TEST';
test('test 403 NO_USER_PERMISSION', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 403,
            data: {
                message: 'Access to this resource has not yet been requested.',
            },
        });
    });
    const result = AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi(AlexaDeviceAddress_1.AlexaDeviceAddress.ADDRESS, 'apiEndPoint', 'permissionToken', 'deviceId');
    expect(result).rejects.toThrow('Access to this resource has not yet been requested.');
    try {
        await result;
    }
    catch (e) {
        expect(e.code).toBe(ApiError_1.ApiError.NO_USER_PERMISSION);
    }
});
test('test 403 NO_SKILL_PERMISSION', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 403,
            data: {
                message: 'Access to this resource cannot be requested.',
            },
        });
    });
    const result = AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi(AlexaDeviceAddress_1.AlexaDeviceAddress.ADDRESS, 'apiEndPoint', 'permissionToken', 'deviceId');
    expect(result).rejects.toThrow('Access to this resource cannot be requested.');
    try {
        await result;
    }
    catch (e) {
        expect(e.code).toBe(ApiError_1.ApiError.NO_SKILL_PERMISSION);
    }
});
test('test 403 ERROR', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.reject(new Error());
    });
    const result = AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi(AlexaDeviceAddress_1.AlexaDeviceAddress.ADDRESS, 'apiEndPoint', 'permissionToken', 'deviceId');
    expect(result).rejects.toThrow('Something went wrong.');
    try {
        await result;
    }
    catch (e) {
        expect(e.code).toBe(ApiError_1.ApiError.ERROR);
    }
});
test('test ADDRESS', async () => {
    const addressData = {
        addressLine1: 'addressLine1',
        addressLine2: 'addressLine2',
        addressLine3: '',
        districtOrCounty: '',
        stateOrRegion: 'stateOrRegion',
        city: 'city',
        countryCode: 'countryCode',
        postalCode: 'postalCode',
    };
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: addressData,
        });
    });
    const result = AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi(AlexaDeviceAddress_1.AlexaDeviceAddress.ADDRESS, 'apiEndPoint', 'permissionToken', 'deviceId');
    expect(result).resolves.toBe(addressData);
});
test('test COUNTRY_AND_POSTAL_CODE', async () => {
    const addressData = { countryCode: 'DE', postalCode: '10435' };
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: addressData,
        });
    });
    const result = AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi(AlexaDeviceAddress_1.AlexaDeviceAddress.COUNTRY_AND_POSTAL_CODE, 'apiEndPoint', 'permissionToken', 'deviceId');
    expect(result).resolves.toBe(addressData);
});
test('test invalid property', async () => {
    expect(AlexaDeviceAddress_1.AlexaDeviceAddress.deviceAddressApi('propertyABC', 'apiEndPoint', 'permissionToken', 'deviceId')).rejects.toThrow('propertyABC is not a valid property');
});
//# sourceMappingURL=AlexaDeviceAddress.test.js.map