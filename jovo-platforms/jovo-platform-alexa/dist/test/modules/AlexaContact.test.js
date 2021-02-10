"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaAPI_1 = require("../../src/services/AlexaAPI");
const AlexaContact_1 = require("../../src/services/AlexaContact");
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
    const result = AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.NAME, 'apiEndPoint', 'permissionToken');
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
    const result = AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.NAME, 'apiEndPoint', 'permissionToken');
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
    const result = AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.NAME, 'apiEndPoint', 'permissionToken');
    expect(result).rejects.toThrow('Something went wrong.');
    try {
        await result;
    }
    catch (e) {
        expect(e.code).toBe(ApiError_1.ApiError.ERROR);
    }
});
test('test NAME', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: 'John Doe',
        });
    });
    expect(AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.NAME, 'apiEndPoint', 'permissionToken')).resolves.toBe('John Doe');
});
test('test FULLNAME', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: 'John Doe',
        });
    });
    expect(AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.NAME, 'apiEndPoint', 'permissionToken')).resolves.toBe('John Doe');
});
test('test GIVEN_NAME', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: 'Joe',
        });
    });
    expect(AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.GIVEN_NAME, 'apiEndPoint', 'permissionToken')).resolves.toBe('Joe');
});
test('test MOBILE_NUMBER', async () => {
    // @ts-ignore
    AlexaAPI_1.AlexaAPI.apiCall.mockImplementation(({}) => {
        return Promise.resolve({
            status: 200,
            data: '12345',
        });
    });
    expect(AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.MOBILE_NUMBER, 'apiEndPoint', 'permissionToken')).resolves.toBe('12345');
});
test('test undefined permissionToken', async () => {
    const token = undefined;
    // @ts-ignore
    expect(AlexaContact_1.AlexaContact.contactAPI(AlexaContact_1.AlexaContact.EMAIL, 'apiEndPoint', token)).rejects.toThrow('No permissions from user.');
});
test('test invalid property', async () => {
    expect(AlexaContact_1.AlexaContact.contactAPI('propertyABC', 'apiEndPoint', 'permissionToken')).rejects.toThrow('propertyABC is not a valid property');
});
//# sourceMappingURL=AlexaContact.test.js.map