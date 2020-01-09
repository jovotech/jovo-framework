import {CorePlatformRequest} from '../src';

const launchJSON = require('../sample-request-json/v1/LaunchRequest.json'); // tslint:disable-line
const intentJSON = require('../sample-request-json/v1/IntentRequest.json'); // tslint:disable-line

process.env.NODE_ENV = 'TEST';

test('test isLaunch', () => {
    const launchReq = CorePlatformRequest.fromJSON(launchJSON);
    expect(launchReq.isLaunch).toBe(true);

    const nonLaunchReq = CorePlatformRequest.fromJSON(intentJSON);
    expect(nonLaunchReq.isLaunch).toBeUndefined();
});
