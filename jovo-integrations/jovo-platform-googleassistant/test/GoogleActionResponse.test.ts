

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

test.only('test getCard', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
console.log(responseWithState.getCard());
    // expect(responseWithState.getDisplayText()).toMatch('Sample Display Text');
    expect(responseWithState.getCard()).not.toBeUndefined();

    // const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    // expect(responseWithoutState.getDisplayText()).toBeUndefined();
});

test('test getDisplayText', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));

    expect(responseWithState.getDisplayText()).toMatch('Sample Display Text');
    expect(responseWithState.getDisplayText()).not.toBeUndefined();

    const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getDisplayText()).toBeUndefined();
});

test('test getSuggestionChips', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
    const suggestionChips = responseWithState.getSuggestionChips();

    expect(suggestionChips).not.toBeUndefined();
    expect(suggestionChips[0].title).toMatch('Suggestion 1');
    expect(suggestionChips[1].title).toMatch('Suggestion 2');
    expect(suggestionChips[2].title).toMatch('Suggestion 3');

    const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getSuggestionChips()).toBeUndefined();
});

test('test hasSuggestionChips', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));

    expect(responseWithState.hasSuggestionChips('Suggestion 1')).toBe(true);
    expect(responseWithState.hasSuggestionChips('test123')).toBe(false);
    expect(responseWithState.hasSuggestionChips()).toBe(true);

    expect(responseWithState.hasSuggestionChips('Suggestion 1', 'Suggestion 2')).toBe(true);
    expect(responseWithState.hasSuggestionChips('test123', 'Suggestion 2')).toBe(false);

    expect(responseWithState.hasSuggestionChips('Suggestion 1', 'Suggestion 2', 'Suggestion 3')).toBe(true);
    expect(responseWithState.hasSuggestionChips('Suggestion 1', 'test123', 'Suggestion 3')).toBe(false);

    expect(responseWithState.hasSuggestionChips(
        'Suggestion 1',
        'Suggestion 2',
        'Suggestion 3',
        'Suggestion 4',
        'Suggestion 5',
        'Suggestion 6',
        'Suggestion 7',
        'Suggestion 8'
    )).toBe(true);
    expect(responseWithState.hasSuggestionChips(
        'Suggestion 1',
        'Suggestion 2',
        'Suggestion 3',
        'Suggestion 4',
        'Test123',
        'Suggestion 6',
        'Suggestion 7',
        'Suggestion 8'
    )).toBe(false);

    const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasSuggestionChips('test123')).toBe(false);
    expect(responseWithoutState.hasSuggestionChips()).toBe(false);
});
