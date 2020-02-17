import _cloneDeep = require('lodash.clonedeep');
import { DialogflowResponse } from '../src';
const askJSON = require('../sample-response-json/v2/ASK.json');
const tellJSON = require('../sample-response-json/v2/TELL.json');

process.env.NODE_ENV = 'TEST';

test('test hasState', () => {
  const responseWithState = DialogflowResponse.fromJSON(_cloneDeep(askJSON));

  expect(responseWithState.hasState('test')).toBe(true);
  expect(responseWithState.hasState('test123')).toBe(false);
  expect(responseWithState.hasState()).toBe(true);

  const responseWithoutState = DialogflowResponse.fromJSON(_cloneDeep(tellJSON));
  expect(responseWithoutState.hasState('test123')).toBe(false);
  expect(responseWithoutState.hasState()).toBe(false);
});

test('test hasSessionData', () => {
  const responseWithState = DialogflowResponse.fromJSON(_cloneDeep(askJSON));

  expect(responseWithState.hasSessionData('session', 'attribute')).toBe(true);
  expect(responseWithState.hasSessionData('session', 'closed')).toBe(false);

  expect(responseWithState.hasSessionData('session')).toBe(true);
  expect(responseWithState.hasSessionData('age')).toBe(false);
});

test('test isAsk', () => {
  const response = DialogflowResponse.fromJSON(_cloneDeep(askJSON));

  expect(response.isAsk()).toBe(true);
  expect(response.isTell()).toBe(false);
});

test('test isTell', () => {
  const response = DialogflowResponse.fromJSON(_cloneDeep(tellJSON));

  expect(response.isTell()).toBe(true);
  expect(response.isAsk()).toBe(false);
});
