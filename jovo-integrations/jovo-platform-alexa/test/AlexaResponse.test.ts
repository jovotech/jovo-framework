

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

test('test hasState', () => {
    const responseWithState = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    responseWithState.sessionAttributes = {"_JOVO_STATE_":"test"};

    expect(responseWithState.hasState('test')).toBe(true);
    expect(responseWithState.hasState('test123')).toBe(false);
    expect(responseWithState.hasState()).toBe(true);

    const responseWithoutState = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasState('test123')).toBe(false);
    expect(responseWithoutState.hasState()).toBe(false);
});

test('test hasSimpleCard', () => {
    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.hasSimpleCard()).toBe(true);

    expect(tellResponse.hasSimpleCard('Simple Title')).toBe(true);
    expect(tellResponse.hasSimpleCard('title')).toBe(false);

    expect(tellResponse.hasSimpleCard('Simple Title', 'Simple Text')).toBe(true);
    expect(tellResponse.hasSimpleCard('Simple Title', 'no')).toBe(false);
});

test('test hasStandardCard', () => {
    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasStandardCard()).toBe(true);

    expect(askResponse.hasStandardCard('Standard Title')).toBe(true);
    expect(askResponse.hasStandardCard('title')).toBe(false);

    expect(askResponse.hasStandardCard('Standard Title', 'Standard Text')).toBe(true);
    expect(askResponse.hasStandardCard('Standard Title', 'no')).toBe(false);

    expect(askResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/720x480'
    )).toBe(true);
    expect(askResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/'
    )).toBe(false);

    expect(askResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/720x480',
        'https://via.placeholder.com/1200x800'
    )).toBe(true);
    expect(askResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/',
        'https://via.placeholder.com/'
    )).toBe(false);
});
