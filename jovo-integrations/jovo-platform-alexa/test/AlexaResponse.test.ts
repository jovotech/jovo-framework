

import {AlexaResponse} from "../src/core/AlexaResponse";
const tellJSON = require('./../sample-response-json/v1/TELL.json');
const askJSON = require('./../sample-response-json/v1/ASK.json');
import _cloneDeep = require('lodash.clonedeep');

process.env.NODE_ENV = 'TEST';

test('test isTell', () => {
    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.isTell()).toBe(true);
    expect(tellResponse.isTell('Simple Tell')).toBe(true);
    expect(tellResponse.isTell(['Simple Tell', 'foo', 'bar'])).toBe(true);

    expect(tellResponse.isTell('Foo')).toBe(false);
    expect(tellResponse.isTell(['foo', 'bar'])).toBe(false);


    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.isTell()).toBe(false);

});


test('test isAsk', () => {
    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.isAsk()).toBe(true);
    expect(askResponse.isAsk('Simple Ask')).toBe(true);
    expect(askResponse.isAsk('Simple Ask', 'Simple Ask Reprompt')).toBe(true);

    expect(askResponse.isAsk(['Simple Ask', 'foo', 'bar'])).toBe(true);
    expect(askResponse.isAsk(['Simple Ask', 'foo', 'bar'], ['Simple Ask Reprompt', 'foo', 'bar'])).toBe(true);

    expect(askResponse.isAsk('Foo')).toBe(false);
    expect(askResponse.isAsk(['foo', 'bar'])).toBe(false);

    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.isAsk()).toBe(false);

});



