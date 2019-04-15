

import {DialogflowResponse} from "../src/core/DialogflowResponse";
import _cloneDeep = require('lodash.clonedeep');
const askJSON = require('./../sample-response-json/v2/ASK.json');
const tellJSON = require('./../sample-response-json/v2/TELL.json');
const simpleCard = require('./../sample-response-json/v2/SimpleCardTell.json');
const standardCard = require('./../sample-response-json/v2/StandardCardAsk.json');

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

