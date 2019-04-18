

import {GoogleActionResponse} from "../src/core/GoogleActionResponse";
import _cloneDeep = require('lodash.clonedeep');
const askJSON = require('./../sample-response-json/v2/ASK.json');
const tellJSON = require('./../sample-response-json/v2/TELL.json');

process.env.NODE_ENV = 'TEST';

test('test hasDisplayText', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));

    expect(responseWithState.hasDisplayText('Sample Display Text')).toBe(true);
    expect(responseWithState.hasDisplayText('test123')).toBe(false);
    expect(responseWithState.hasDisplayText()).toBe(true);

    const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasDisplayText('test123')).toBe(false);
    expect(responseWithoutState.hasDisplayText()).toBe(false);
});
