"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _cloneDeep = require("lodash.clonedeep");
const src_1 = require("../src");
const askJSON = require('../sample-response-json/v2/ASK.json');
const tellJSON = require('../sample-response-json/v2/TELL.json');
process.env.NODE_ENV = 'TEST';
test('test hasState', () => {
    const responseWithState = src_1.DialogflowResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.hasState('test')).toBe(true);
    expect(responseWithState.hasState('test123')).toBe(false);
    expect(responseWithState.hasState()).toBe(true);
    const responseWithoutState = src_1.DialogflowResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasState('test123')).toBe(false);
    expect(responseWithoutState.hasState()).toBe(false);
});
test('test hasSessionData', () => {
    const responseWithState = src_1.DialogflowResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.hasSessionData('session', 'attribute')).toBe(true);
    expect(responseWithState.hasSessionData('session', 'closed')).toBe(false);
    expect(responseWithState.hasSessionData('session')).toBe(true);
    expect(responseWithState.hasSessionData('age')).toBe(false);
});
test('test isAsk', () => {
    const response = src_1.DialogflowResponse.fromJSON(_cloneDeep(askJSON));
    expect(response.isAsk()).toBe(true);
    expect(response.isTell()).toBe(false);
});
test('test isTell', () => {
    const response = src_1.DialogflowResponse.fromJSON(_cloneDeep(tellJSON));
    expect(response.isTell()).toBe(true);
    expect(response.isAsk()).toBe(false);
});
//# sourceMappingURL=DialogflowResponse.test.js.map