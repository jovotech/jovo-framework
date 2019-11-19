import { AlexaRequest } from '../src/core/AlexaRequest';
import _cloneDeep = require('lodash.clonedeep');
const launchJSON = require('../sample-request-json/v1/LaunchRequest.json');
const autoLaunchJSON = require('../sample-request-json/v1/AutomotiveLaunchRequest.json');

process.env.NODE_ENV = 'TEST';

test('test hasAutomotive', () => {
  const autoRequest = AlexaRequest.fromJSON(_cloneDeep(autoLaunchJSON));
  expect(autoRequest.hasAutomotive()).toBe(true);

  const nonAutoRequest = AlexaRequest.fromJSON(_cloneDeep(launchJSON));
  expect(nonAutoRequest.hasAutomotive()).toBe(false);
});
