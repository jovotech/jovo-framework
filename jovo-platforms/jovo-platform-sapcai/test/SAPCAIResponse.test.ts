

import {SAPCAIResponse} from "../src/SAPCAIResponse";
import _cloneDeep = require('lodash.clonedeep');
const tellJSON = require('../sample-response-json/v1/TELL.json');
const askJSON = require('../sample-response-json/v1/ASK.json');

process.env.NODE_ENV = 'TEST';

test('test getReprompt', () => {
    const tellResponse = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.getReprompt()).toBeUndefined();
});

test('test isTell', () => {
    const tellResponse = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(tellResponse.isTell()).toBe(true);
    expect(tellResponse.isTell('Simple Tell')).toBe(true);
    expect(tellResponse.isTell(['Simple Tell', 'foo', 'bar'])).toBe(true);

    expect(tellResponse.isTell('Foo')).toBe(false);
    expect(tellResponse.isTell(['foo', 'bar'])).toBe(false);

});

test('test hasState', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));
    responseWithState.conversation.memory = {"_JOVO_STATE_":"test"};

    expect(responseWithState.hasState('test')).toBe(true);
    expect(responseWithState.hasState('test123')).toBe(false);
    expect(responseWithState.hasState()).toBe(true);

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasState('test123')).toBe(false);
    expect(responseWithoutState.hasState()).toBe(false);
});

test('test hasStandardCard', () => {
    const standardCardResponse = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));
    expect(standardCardResponse.hasStandardCard()).toBe(true);

    expect(standardCardResponse.hasStandardCard('Standard Title')).toBe(true);
    expect(standardCardResponse.hasStandardCard('title')).toBe(false);

    expect(standardCardResponse.hasStandardCard('Standard Title', 'Standard Text')).toBe(true);
    expect(standardCardResponse.hasStandardCard('Standard Title', 'no')).toBe(false);

    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/1200x800'
    )).toBe(true);
    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/'
    )).toBe(false);

    expect(standardCardResponse.hasStandardCard(
        'Standard Title',
        'Standard Text',
        'https://via.placeholder.com/1200x800'
    )).toBe(true);

    const askResponse = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(askResponse.hasStandardCard()).toBe(false);

});

test('test getQuickResponseCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));
    const quickReplies = responseWithState.getQuickReplyCard();

    expect(quickReplies).not.toBeUndefined();
    expect(quickReplies.content.title).toMatch('Quick Reply Test');
    expect(quickReplies.content.buttons[0].title).toMatch('QR button 1 title');
    expect(quickReplies.content.buttons[1].title).toMatch('QR button 2 title');

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getQuickReplyCard()).toBeUndefined();
});

test('test hasQuickResponseCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));

    expect(responseWithState.hasQuickReplyCard('Quick Reply Test')).toBe(true);
    expect(responseWithState.hasQuickReplyCard('Quick Reply Test', 'QR button 1 title')).toBe(true);
    expect(responseWithState.hasQuickReplyCard('test123')).toBe(false);
    expect(responseWithState.hasQuickReplyCard('test123', 'QR button 1 title')).toBe(false);
    expect(responseWithState.hasQuickReplyCard()).toBe(false);

    expect(responseWithState.hasQuickReplyCard('Quick Reply Test', 'QR button 1 title', 'QR button 2 title')).toBe(true);
    expect(responseWithState.hasQuickReplyCard('Quick Reply Test', 'test123', 'QR button 2 title')).toBe(false);

    expect(responseWithState.hasQuickReplyCard('Quick Reply Test', 'QR button 1 title', 'QR button 2 title', 'QR button 3 title')).toBe(true);
    expect(responseWithState.hasQuickReplyCard('Quick Reply Test', 'QR button 1 title', 'test123', 'QR button 2 title')).toBe(false);

    expect(responseWithState.hasQuickReplyCard(
        'Quick Reply Test', 
        'QR button 1 title',
        'QR button 2 title',
        'QR button 3 title',
        'QR button 4 title',
    )).toBe(true);
    expect(responseWithState.hasQuickReplyCard(
        'Quick Reply Test', 
        'QR button 1 title',
        'QR button 2 title',
        'Test123',
        'QR button 3 title',
    )).toBe(false);

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasQuickReplyCard('Quick Reply Test', 'test123')).toBe(false);
    expect(responseWithoutState.hasQuickReplyCard()).toBe(false);
});

test('test getButtonsCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));
    const quickReplies = responseWithState.getButtonsCard();

    expect(quickReplies).not.toBeUndefined();
    expect(quickReplies.content.title).toMatch('Button List');
    expect(quickReplies.content.buttons[0].title).toMatch('BL button 1 title');
    expect(quickReplies.content.buttons[1].title).toMatch('BL button 2 title');

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getButtonsCard()).toBeUndefined();
});

test('test hasButtonsCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));

    expect(responseWithState.hasButtonsCard('Button List')).toBe(true);
    expect(responseWithState.hasButtonsCard('Button List', 'BL button 1 title')).toBe(true);
    expect(responseWithState.hasButtonsCard('test123')).toBe(false);
    expect(responseWithState.hasButtonsCard('test123', 'BL button 1 title')).toBe(false);
    expect(responseWithState.hasButtonsCard()).toBe(false);

    expect(responseWithState.hasButtonsCard('Button List', 'BL button 1 title', 'BL button 2 title')).toBe(true);
    expect(responseWithState.hasButtonsCard('Button List', 'test123', 'BL button 2 title')).toBe(false);

    expect(responseWithState.hasButtonsCard('Button List', 'BL button 1 title', 'BL button 2 title', 'BL button 3 title')).toBe(true);
    expect(responseWithState.hasButtonsCard('Button List', 'BL button 1 title', 'test123', 'BL button 2 title')).toBe(false);

    expect(responseWithState.hasButtonsCard(
        'Button List', 
        'BL button 1 title',
        'BL button 2 title',
        'BL button 3 title',
        'BL button 4 title',
    )).toBe(true);
    expect(responseWithState.hasButtonsCard(
        'Button List', 
        'BL button 1 title',
        'BL button 2 title',
        'Test123',
        'BL button 3 title',
    )).toBe(false);

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasButtonsCard('Button List', 'test123')).toBe(false);
    expect(responseWithoutState.hasButtonsCard()).toBe(false);
});

test('test getCarouselCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));
    const quickReplies = responseWithState.getCarouselCard();

    expect(quickReplies).not.toBeUndefined();
    expect(quickReplies.content[0].title).toMatch('Carousel title 1');
    expect(quickReplies.content[0].subtitle).toMatch('Carousel Subtitle 1');
    expect(quickReplies.content[0].imageUrl).toMatch('https://materializecss.com/images/sample-1.jpg');
    expect(quickReplies.content[0].buttons[0].title).toMatch('Carousel button 1 title');
    expect(quickReplies.content[0].buttons[1].title).toMatch('Carousel button 2 title');

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getCarouselCard()).toBeUndefined();
});

test('test hasCarouselCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));

    expect(responseWithState.hasCarouselCard({
        "title": "Carousel title 1",
        "subtitle": "Carousel Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg"
    })).toBe(true);

    expect(responseWithState.hasCarouselCard({
        "title": "Carousel title 1",
        "subtitle": "Carousel Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg",
        "buttons": [{
            "title": "Carousel button 1 title"
        }]
    })).toBe(true);

    expect(responseWithState.hasCarouselCard({
        "title": "Carousel title 4"
    })).toBe(false);

    expect(responseWithState.hasCarouselCard({
        "title": "Carousel title 1",
        "subtitle": "Carousel Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg",
        "buttons": [{
            "title": "Carousel button 3 title"
        }]
    })).toBe(false);

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasCarouselCard({
        "title": "Carousel title 1",
        "subtitle": "Carousel Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg",
    })).toBe(false);
    expect(responseWithoutState.hasCarouselCard()).toBe(false);
});


test('test getListCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));
    const quickReplies = responseWithState.getListCard();

    expect(quickReplies).not.toBeUndefined();
    expect(quickReplies.content.elements[0].title).toMatch('List title 1');
    expect(quickReplies.content.elements[0].subtitle).toMatch('List Subtitle 1');
    expect(quickReplies.content.elements[0].imageUrl).toMatch('https://materializecss.com/images/sample-1.jpg');
    expect(quickReplies.content.elements[0].buttons[0].title).toMatch('List button 1 title');
    expect(quickReplies.content.elements[0].buttons[1].title).toMatch('List button 2 title');
    expect(quickReplies.content.buttons[0].title).toMatch('List button 4 title');
    expect(quickReplies.content.buttons[1].title).toMatch('List button 5 title');

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.getListCard()).toBeUndefined();
});

test('test hasListCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));

    expect(responseWithState.hasListCard([{
        "title": "List title 1",
        "subtitle": "List Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg"
    }])).toBe(true);

    expect(responseWithState.hasListCard([{
        "title": "List title 1",
        "subtitle": "List Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg",
        "buttons": [{
            "title": "List button 1 title"
        }]
    }])).toBe(true);

    expect(responseWithState.hasListCard([{
        "title": "List title 1",
        "subtitle": "List Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg",
        "buttons": [{
            "title": "List button 1 title"
        }]
    }], ["List button 4 title"])).toBe(true);

    expect(responseWithState.hasListCard([{
        "title": "List title 4"
    }])).toBe(false);

    expect(responseWithState.hasListCard([{
        "title": "List title 1",
        "subtitle": "List Subtitle 1",
        "imageUrl": "https://materializecss.com/images/404.jpg"
    }])).toBe(false);

    expect(responseWithState.hasListCard([{
        "title": "List title 1",
        "subtitle": "List Subtitle 1",
        "imageUrl": "https://materializecss.com/images/sample-1.jpg",
        "buttons": [{
            "title": "List button 9 title"
        }]
    }])).toBe(false);

    const responseWithoutState = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(responseWithoutState.hasListCard([{
        "title": "List title 1",
        "subtitle": "List Subtitle 1",
        "imageUrl": "https://materializecss.com/images/404.jpg"
    }])).toBe(false);
    expect(responseWithoutState.hasListCard()).toBe(false);
});

test('test hasImageCard', () => {
    const responseWithState = SAPCAIResponse.fromJSON(_cloneDeep(askJSON));
    expect(responseWithState.hasImageCard()).toBe(false);
    expect(responseWithState.hasImageCard('https://materializecss.com/images/showcase/varun_malhotra.jpg')).toBe(true);
    expect(responseWithState.hasImageCard('Shttps://materializecss.com/images/showcase/404.jpg')).toBe(false);


    const imageCardResponse = SAPCAIResponse.fromJSON(_cloneDeep(tellJSON));
    expect(imageCardResponse.hasImageCard()).toBe(false);
});