'use strict';
let expect = require('chai').expect;
const GoogleActionResponse = require('../../../lib/platforms/googleaction/googleActionResponse').GoogleActionResponse;

describe('Tests for GoogleActionResponse Class', function() {
    describe.skip('constructor()', function() {
        //
    });

    describe('tell()', function() {
        it('should return a valid tell response object', () => {
            let response = new GoogleActionResponse();
            response.tell('<speak>Hello Test</speak>');
            let responseObj = response.responseObj;
            let responseObjData = responseObj.data;
            expect(responseObj.speech).to.equal('<speak>Hello Test</speak>');
            expect(responseObjData.google.expectUserResponse).to.equal(false);
            expect(responseObjData.google.richResponse.items.length).to.equal(1);
            expect(responseObjData.google.richResponse.items[0].simpleResponse.ssml).to.equal('<speak>Hello Test</speak>');
        });
    });

    describe('ask()', function() {
        it('should return a valid ask response object', () => {
            let response = new GoogleActionResponse();
            response.ask('<speak>Hello Test?</speak>', ['<speak>Hello?</speak>']);          // TODO only works with array, what if just a string is passed

            let responseObj = response.responseObj;
            let responseObjData = responseObj.data;
            expect(responseObj.speech).to.equal('<speak>Hello Test?</speak>');
            expect(responseObjData.google.expectUserResponse).to.equal(true);
            expect(responseObjData.google.noInputPrompts.length).to.equal(1);
            expect(responseObjData.google.noInputPrompts[0].ssml).to.equal('<speak>Hello?</speak>');
        });
    });

    describe('play()', function() {
        it('should return a valid tell response object that plays ssml audio', () => {
            let response = new GoogleActionResponse();
            response.play('https://www.example.com/audio.mp3', 'FallbackText');

            let responseObj = response.responseObj;
            expect(responseObj.speech).to.equal('<speak><audio src="https://www.example.com/audio.mp3">FallbackText</audio></speak>');
            expect(responseObj.data.google.expectUserResponse).to.equal(false);
        });

        it('should throw an error on a non-https url', () => {
            let response = new GoogleActionResponse();
            expect(() => {
                response.play('');                                                  // TODO url with http
            }).to.throw('Url protocol must be https.').with.property('status', 400);
        });
    });

    describe('addBasicCard()', function() {
        it('should return a valid tell response with a basic card', () => {
            let response = new GoogleActionResponse();
            response.addBasicCard('Title', 'Body').tell('<speak>Hello Test</speak>');

            let responseObj = response.responseObj;
            let responseObjData = responseObj.data;
            expect(responseObj.speech).to.equal('<speak>Hello Test</speak>');
            expect(responseObjData.google.expectUserResponse).to.equal(false);
            expect(responseObjData.google.richResponse.items.length).to.equal(2);
            expect(responseObjData.google.richResponse.items[0].simpleResponse.ssml).to.equal('<speak>Hello Test</speak>');
            expect(responseObjData.google.richResponse.items[1].basicCard.title).to.equal('Title');
            expect(responseObjData.google.richResponse.items[1].basicCard.formattedText).to.equal('Body');
        });

        it('should throw an error stating to not pass an empty title', () => {
            let response = new GoogleActionResponse();
            expect(() => {
                response.addBasicCard('', 'Body');
            }).to.throw('Title cannot be empty');
        });

        it('should throw an error stating to not pass an empty formatted text', () => {
            let response = new GoogleActionResponse();
            expect(() => {
                response.addBasicCard('Title', '');
            }).to.throw('FormattedText cannot be empty');
        });
    });

    describe('addImageCard()', function() {
        it('should return a valid tell response with an image card', () => {
            let response = new GoogleActionResponse();
            response.addImageCard('Title', 'Body', 'https://expample.org/image.png', 'Accessibility').tell('<speak>Hello Test</speak>');

            let responseObj = response.responseObj;
            let responseObjData = responseObj.data;
            expect(responseObj.speech).to.equal('<speak>Hello Test</speak>');
            expect(responseObjData.google.expectUserResponse).to.equal(false);
            expect(responseObjData.google.richResponse.items.length).to.equal(2);
            expect(responseObjData.google.richResponse.items[0].simpleResponse.ssml).to.equal('<speak>Hello Test</speak>');
            expect(responseObjData.google.richResponse.items[1].basicCard.title).to.equal('Title');
            expect(responseObjData.google.richResponse.items[1].basicCard.formattedText).to.equal('Body');
            expect(responseObjData.google.richResponse.items[1].basicCard.image.url).to.equal('https://expample.org/image.png');
            expect(responseObjData.google.richResponse.items[1].basicCard.image.accessibilityText).to.equal('Accessibility');
        });
    });

    describe.skip('getContextOut()', function() {

    });

    describe.skip('setContextOut()', function() {

    });

    describe.skip('addContextOutObject()', function() {

    });

    describe.skip('addContextOutParameter()', function() {

    });

    describe.skip('getContextOutParameter()', function() {

    });

    describe.skip('getResponseObject()', function() {

    });

    describe.skip('getSpeechText()', function() {

    });

    describe.skip('isTell()', function() {

    });

    describe.skip('isAsk()', function() {

    });

    describe.skip('isPlay()', function() {

    });

    describe.skip('hasBasicCard()', function() {

    });

    describe.skip('hasImageCard()', function() {

    });

    describe.skip('hasContextOutParameter()', function() {

    });

    describe.skip('speechTextContains()', function() {

    });
});
