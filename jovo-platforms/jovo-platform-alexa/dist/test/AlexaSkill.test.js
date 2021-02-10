"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaSkill_1 = require("../src/core/AlexaSkill");
const alexa_enums_1 = require("../src/core/alexa-enums");
process.env.NODE_ENV = 'UNIT_TEST';
let alexaSkill;
const app = {}; // hack so we don't have to implement the interface
const host = {};
beforeEach(() => {
    alexaSkill = new AlexaSkill_1.AlexaSkill(app, host);
});
describe('test isEventRequest()', () => {
    test('should return true', () => {
        alexaSkill.$type.type = alexa_enums_1.EnumAlexaRequestType.ON_EVENT;
        const result = alexaSkill.isEventRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        alexaSkill.$type.type = 'test';
        const result = alexaSkill.isEventRequest();
        expect(result).toBe(false);
    });
});
describe('test isPurchaseResult()', () => {
    test('should return true', () => {
        alexaSkill.$type.type = alexa_enums_1.EnumAlexaRequestType.ON_PURCHASE;
        const result = alexaSkill.isPurchaseRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        alexaSkill.$type.type = 'test';
        const result = alexaSkill.isPurchaseRequest();
        expect(result).toBe(false);
    });
});
describe('test isCanFulfillIntentRequest()', () => {
    test('should return true', () => {
        alexaSkill.$type.type = alexa_enums_1.EnumAlexaRequestType.CAN_FULFILL_INTENT;
        const result = alexaSkill.isCanFulfillIntentRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        alexaSkill.$type.type = 'test';
        const result = alexaSkill.isCanFulfillIntentRequest();
        expect(result).toBe(false);
    });
});
describe('test isPlaybackControllerRequest()', () => {
    test('should return true', () => {
        alexaSkill.$type.type = alexa_enums_1.EnumAlexaRequestType.PLAYBACKCONTROLLER;
        const result = alexaSkill.isPlaybackControllerRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        alexaSkill.$type.type = 'test';
        const result = alexaSkill.isPlaybackControllerRequest();
        expect(result).toBe(false);
    });
});
describe('test isGameEngineInputHandlerEventRequest()', () => {
    test('should return true', () => {
        alexaSkill.$type.type = alexa_enums_1.EnumAlexaRequestType.ON_GAME_ENGINE_INPUT_HANDLER_EVENT;
        const result = alexaSkill.isGameEngineInputHandlerEventRequest();
        expect(result).toBe(true);
    });
    test('should return false', () => {
        alexaSkill.$type.type = 'test';
        const result = alexaSkill.isGameEngineInputHandlerEventRequest();
        expect(result).toBe(false);
    });
});
//# sourceMappingURL=AlexaSkill.test.js.map