"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AlexaRequest_1 = require("../src/core/AlexaRequest");
const _cloneDeep = require("lodash.clonedeep");
const launchJSON = require('../sample-request-json/v1/LaunchRequest.json');
const autoLaunchJSON = require('../sample-request-json/v1/AutomotiveLaunchRequest.json');
process.env.NODE_ENV = 'TEST';
test('test hasAutomotive', () => {
    const autoRequest = AlexaRequest_1.AlexaRequest.fromJSON(_cloneDeep(autoLaunchJSON));
    expect(autoRequest.hasAutomotive()).toBe(true);
    const nonAutoRequest = AlexaRequest_1.AlexaRequest.fromJSON(_cloneDeep(launchJSON));
    expect(nonAutoRequest.hasAutomotive()).toBe(false);
});
//# sourceMappingURL=AlexaRequest.test.js.map