"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const GoogleAction_1 = require("../src/core/GoogleAction");
const google_assistant_enums_1 = require("../src/core/google-assistant-enums");
let googleAction;
const app = {};
const host = {};
beforeEach(() => {
    googleAction = new GoogleAction_1.GoogleAction(app, host);
});
describe('test isSignInRequest()', () => {
    test('should return true', () => {
        googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_SIGN_IN;
        const result = googleAction.isSignInRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        googleAction.$type.type = 'test';
        const result = googleAction.isSignInRequest();
        expect(result).toBe(false);
    });
});
describe('test isPermissionRequest()', () => {
    test('should return true', () => {
        googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PERMISSION;
        const result = googleAction.isPermissionRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        googleAction.$type.type = 'test';
        const result = googleAction.isPermissionRequest();
        expect(result).toBe(false);
    });
});
describe('test isConfirmationRequest()', () => {
    test('should return true', () => {
        googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_CONFIRMATION;
        const result = googleAction.isConfirmationRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        googleAction.$type.type = 'test';
        const result = googleAction.isConfirmationRequest();
        expect(result).toBe(false);
    });
});
describe('test isDateTimeRequest()', () => {
    test('should return true', () => {
        googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_DATETIME;
        const result = googleAction.isDateTimeRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        googleAction.$type.type = 'test';
        const result = googleAction.isDateTimeRequest();
        expect(result).toBe(false);
    });
});
describe('test isPlaceRequest()', () => {
    test('should return true', () => {
        googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PLACE;
        const result = googleAction.isPlaceRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        googleAction.$type.type = 'test';
        const result = googleAction.isPlaceRequest();
        expect(result).toBe(false);
    });
});
//# sourceMappingURL=GoogleAction.test.js.map