

import {AlexaResponse} from "../src/core/AlexaResponse";
import _cloneDeep = require('lodash.clonedeep');
const directivesJSON = require('../sample-response-json/v1/directives.json');
const askJSON = require('../sample-response-json/v1/ASK.json');
const tellJSON = require('../sample-response-json/v1/TELL.json');
const countryPostalCard = require('../sample-response-json/v1/CountryPostalCardAsk.json');
const fullAddressCard = require('../sample-response-json/v1/FullAddressCardAsk.json');
const linkAccountCard = require('../sample-response-json/v1/LinkAccountCardAsk.json');
const simpleCard = require('../sample-response-json/v1/SimpleCardTell.json');
const standardCard = require('../sample-response-json/v1/StandardCardAsk.json');


process.env.NODE_ENV = 'TEST';

test('test getReprompt', () => {
    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.getReprompt()).toBeUndefined();

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.getReprompt()).toBe('Simple Ask Reprompt');

});


test('test getDirectives', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    const directivesArray = directivesResponse.getDirectives();

    expect(directivesArray).not.toBeUndefined();
    expect(directivesArray[0].type).toMatch('Display.RenderTemplate');
    expect(directivesArray[1].type).toMatch('AudioPlayer.Play');
    expect(directivesArray[2].document.type).toMatch('APL');
    expect(directivesArray[3].type).toMatch('VideoApp.Launch');

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.getDirectives()).toBeUndefined();
});

test('test getAplDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    expect(directivesResponse.getAplDirective()).not.toBeUndefined();

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.getAplDirective()).toBeUndefined();
});

test('test hasAplDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    expect(directivesResponse.hasAplDirective()).toBe(true);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasAplDirective()).toBe(false);
});

test('test getDisplayDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    const displayDirective = directivesResponse.getDisplayDirective();

    expect(displayDirective).not.toBeUndefined();
    expect(displayDirective.type).toMatch('Display.RenderTemplate');

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.getDisplayDirective()).toBeUndefined();
});

test('test hasDisplayDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    expect(directivesResponse.hasDisplayDirective()).toBe(true);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasDisplayDirective()).toBe(false);
});

test('test getAudioDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    const displayDirective = directivesResponse.getAudioDirective();

    expect(displayDirective).not.toBeUndefined();
    expect(displayDirective.type).toMatch('AudioPlayer.Play');

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.getAudioDirective()).toBeUndefined();
});

test('test hasAudioDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    expect(directivesResponse.hasAudioDirective()).toBe(true);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasAudioDirective()).toBe(false);
});

test('test getVideoDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    const displayDirective = directivesResponse.getVideoDirective();

    expect(displayDirective).not.toBeUndefined();
    expect(displayDirective.type).toMatch('VideoApp.Launch');

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.getVideoDirective()).toBeUndefined();
});

test('test hasVideoDirective', () => {
    const directivesResponse = AlexaResponse.fromJSON(_cloneDeep(directivesJSON));
    expect(directivesResponse.hasVideoDirective()).toBe(true);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasVideoDirective()).toBe(false);
});

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
    const simpleCardResponse = AlexaResponse.fromJSON(_cloneDeep(simpleCard));
    expect(simpleCardResponse.hasSimpleCard()).toBe(true);

    expect(simpleCardResponse.hasSimpleCard('Simple Title')).toBe(true);
    expect(simpleCardResponse.hasSimpleCard('title')).toBe(false);

    expect(simpleCardResponse.hasSimpleCard('Simple Title', 'Simple Text')).toBe(true);
    expect(simpleCardResponse.hasSimpleCard('Simple Title', 'no')).toBe(false);

    const tellResponse = AlexaResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.hasStandardCard()).toBe(false);
});

test('test hasStandardCard', () => {
    const standardCardResponse = AlexaResponse.fromJSON(_cloneDeep(standardCard));
    expect(standardCardResponse.hasStandardCard()).toBe(true);

    expect(standardCardResponse.hasStandardCard('Standard Title')).toBe(true);
    expect(standardCardResponse.hasStandardCard('title')).toBe(false);

    expect(standardCardResponse.hasStandardCard('Standard Title', 'Standard Text')).toBe(true);
    expect(standardCardResponse.hasStandardCard('Standard Title', 'no')).toBe(false);

    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/720x480'
    )).toBe(true);
    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/'
    )).toBe(false);

    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/720x480',
        'https://via.placeholder.com/1200x800'
    )).toBe(true);
    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/',
        'https://via.placeholder.com/'
    )).toBe(false);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasStandardCard()).toBe(false);

});

test('test hasLinkAccountCard', () => {
    const linkAccountResponse = AlexaResponse.fromJSON(_cloneDeep(linkAccountCard));
    expect(linkAccountResponse.hasLinkAccountCard()).toBe(true);

    const standardCardResponse = AlexaResponse.fromJSON(_cloneDeep(standardCard));
    expect(standardCardResponse.hasLinkAccountCard()).toBe(false);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasLinkAccountCard()).toBe(false);

});

test('test hasAskForAddressCard', () => {
    const fullAddressResponse = AlexaResponse.fromJSON(_cloneDeep(fullAddressCard));
    expect(fullAddressResponse.hasAskForAddressCard()).toBe(true);

    const countryPostalResponse = AlexaResponse.fromJSON(_cloneDeep(countryPostalCard));
    expect(countryPostalResponse.hasAskForAddressCard()).toBe(false);

    const standardCardResponse = AlexaResponse.fromJSON(_cloneDeep(standardCard));
    expect(standardCardResponse.hasAskForAddressCard()).toBe(false);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasAskForAddressCard()).toBe(false);

});

test('test hasAskForCountryAndPostalCodeCard', () => {
    const countryPostalResponse = AlexaResponse.fromJSON(_cloneDeep(countryPostalCard));
    expect(countryPostalResponse.hasAskForCountryAndPostalCodeCard()).toBe(true);

    const fullAddressResponse = AlexaResponse.fromJSON(_cloneDeep(fullAddressCard));
    expect(fullAddressResponse.hasAskForCountryAndPostalCodeCard()).toBe(false);

    const standardCardResponse = AlexaResponse.fromJSON(_cloneDeep(standardCard));
    expect(standardCardResponse.hasAskForCountryAndPostalCodeCard()).toBe(false);

    const askResponse = AlexaResponse.fromJSON(_cloneDeep(askJSON));
    expect(askResponse.hasAskForCountryAndPostalCodeCard()).toBe(false);

});
