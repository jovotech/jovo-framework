import { GoogleAction } from "../src/core/GoogleAction";
import { EnumGoogleAssistantRequestType } from "../src/core/google-assistant-enums";
import { BaseApp, Host } from "jovo-core";

let googleAction: GoogleAction;
const app = {} as unknown as BaseApp; // hack so we don't have to implement the interface
const host = {} as unknown as Host;

beforeEach(() => {
    googleAction = new GoogleAction(app, host);
});

describe('test isSignInRequest()', () => {
    test('should return true', () => {
        googleAction.$type.type = EnumGoogleAssistantRequestType.ON_SIGN_IN;
    
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
        googleAction.$type.type = EnumGoogleAssistantRequestType.ON_PERMISSION;
    
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
        googleAction.$type.type = EnumGoogleAssistantRequestType.ON_CONFIRMATION;
    
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
        googleAction.$type.type = EnumGoogleAssistantRequestType.ON_DATETIME;
    
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
        googleAction.$type.type = EnumGoogleAssistantRequestType.ON_PLACE;
    
        const result = googleAction.isPlaceRequest();
    
        expect(result).toBe(true);
    });
    
    test('should return false', () => {
        googleAction.$type.type = 'test';

        const result = googleAction.isPlaceRequest();

        expect(result).toBe(false);
    });
});