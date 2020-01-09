"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var src_1 = require("../src");
var launchJSON = require('../sample-request-json/v1/LaunchRequest.json'); // tslint:disable-line
var intentJSON = require('../sample-request-json/v1/IntentRequest.json'); // tslint:disable-line
process.env.NODE_ENV = 'TEST';
test('test isLaunch', function () {
    var launchReq = src_1.CorePlatformRequest.fromJSON(launchJSON);
    expect(launchReq.isLaunch).toBe(true);
    var nonLaunchReq = src_1.CorePlatformRequest.fromJSON(intentJSON);
    expect(nonLaunchReq.isLaunch).toBeUndefined();
});
