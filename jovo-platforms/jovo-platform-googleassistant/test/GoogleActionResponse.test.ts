

import {GoogleActionResponse} from "../src/core/GoogleActionResponse";
import _cloneDeep = require('lodash.clonedeep');
const askJSON = require('../sample-response-json/v2/ASK.json').payload.google;
const imageCardJSON = require('../sample-response-json/v2/tellBasicImageCard.json').payload.google;
const tellJSON = require('../sample-response-json/v2/TELL.json').payload.google;

process.env.NODE_ENV = 'TEST';

test('test getCard', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.getBasicCard().title).toMatch('Sample Card Title');
    expect(responseWithState.getBasicCard()).not.toBeUndefined();

    const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getBasicCard()).toBeUndefined();
});

test('test hasImageCard', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.hasImageCard()).toBe(false);
    expect(responseWithState.hasImageCard('Sample Display Text')).toBe(false);
    expect(responseWithState.hasImageCard('Sample Card Title', 'Sample Card Content')).toBe(false);
    expect(responseWithState.hasImageCard('Sample Card Title', 'Sample Card Content', 'www.image.com')).toBe(false);


    const imageCardResponse = GoogleActionResponse.fromJSON(_cloneDeep(imageCardJSON));
    expect(imageCardResponse.hasImageCard()).toBe(true);
    expect(imageCardResponse.hasImageCard('Sample Display Text')).toBe(false);
    expect(imageCardResponse.hasImageCard('Sample Card Title', 'Sample Card Content')).toBe(true);
    expect(imageCardResponse.hasImageCard('Sample Card Title', 'Sample Jovo Content')).toBe(false);
    expect(imageCardResponse.hasImageCard('Sample Card Title', 'Sample Card Content', 'www.image.com')).toBe(true);
    expect(imageCardResponse.hasImageCard('Sample Card Title', 'Sample Card Content', 'www.jovo.com')).toBe(false);
});

test('test hasSimpleCard', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.hasSimpleCard()).toBe(true);
    expect(responseWithState.hasSimpleCard('Sample Display Text')).toBe(false);
    expect(responseWithState.hasSimpleCard('Sample Card Title', 'Sample Card Content')).toBe(true);
    expect(responseWithState.hasSimpleCard('Sample Card Title', 'Sample Jovo Content')).toBe(false);


    const imageCardResponse = GoogleActionResponse.fromJSON(_cloneDeep(imageCardJSON));
    expect(imageCardResponse.hasSimpleCard()).toBe(false);
    expect(imageCardResponse.hasSimpleCard('Sample Display Text')).toBe(false);
    expect(imageCardResponse.hasSimpleCard('Sample Card Title', 'Sample Card Content')).toBe(false);
});

test('test hasDisplayText', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.hasDisplayText('Sample Display Text')).toBe(true);
    expect(responseWithState.hasDisplayText('test123')).toBe(false);
    expect(responseWithState.hasDisplayText()).toBe(true);

    const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasDisplayText('test123')).toBe(false);
    expect(responseWithoutState.hasDisplayText()).toBe(false);
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

test('test getMediaResponse', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
    const mediaResponse = responseWithState.getMediaResponse();

    expect(mediaResponse).not.toBeUndefined();
    expect(mediaResponse.mediaType).toMatch('AUDIO');
    expect(mediaResponse.mediaObjects[0].name).toMatch('song one');
    expect(mediaResponse.mediaObjects[0].contentUrl).toMatch('https://www.url.to/file.mp3');

    const responseWithoutState = GoogleActionResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getMediaResponse()).toBeUndefined();
});

test('test hasMediaResponse', () => {
    const responseWithState = GoogleActionResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.hasMediaResponse()).toBe(true);
    expect(responseWithState.hasMediaResponse('Sample Display Text')).toBe(false);
    expect(responseWithState.hasMediaResponse('https://www.url.to/file.mp3', 'song one')).toBe(true);
    expect(responseWithState.hasMediaResponse('https://www.url.to/file.mp3', 'Sample Jovo Content')).toBe(false);


    const imageCardResponse = GoogleActionResponse.fromJSON(_cloneDeep(imageCardJSON));
    expect(imageCardResponse.hasMediaResponse()).toBe(false);
    expect(imageCardResponse.hasMediaResponse('Sample Display Text')).toBe(false);
    expect(imageCardResponse.hasMediaResponse('https://www.url.to/file.mp3', 'song one')).toBe(false);
});
