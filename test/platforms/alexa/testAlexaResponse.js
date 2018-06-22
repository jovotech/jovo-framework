'use strict';
const expect = require('chai').expect;
const AlexaResponse = require('../../../lib/platforms/alexaSkill/alexaResponse').AlexaResponse;
const BodyTemplate1 = require('../../../lib/platforms/alexaSkill/response/renderTemplate/bodyTemplate1').BodyTemplate1;

describe('Tests for AlexaResponse Class', function() {
    describe('constructor(responseObj)', function() {
        it('should return an valid empty response object', () => {
            let response = new AlexaResponse();
            expect(response.responseObj.version).to.equal('1.0');
            expect(response.responseObj.response.shouldEndSession).to.be.equal(true);
            expect(Object.keys(response.responseObj)).to.have.lengthOf(3);
        });

        it('should set a responseObj', () => {
            let response = new AlexaResponse(
                {
                    version: '1.0',
                    response: {
                        shouldEndSession: false,
                        outputSpeech: {
                            type: 'SSML',
                            ssml: '<speak>Hello</speak>',
                        },
                    },
                }
            );

            let responseObj = response.responseObj;
            expect(responseObj.response.shouldEndSession).to.be.equal(false);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('Hello');
        });
    });

    describe('tell(speech)', function() {
        it('should return a valid tell response object', () => {
            let response = new AlexaResponse();
            response.tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');

            response = new AlexaResponse();
            response.tell();

            responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.outputSpeech).to.be.an('undefined');

            response = new AlexaResponse();
            response.tell('');

            responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.outputSpeech).to.be.an('undefined');
        });
    });

    describe('ask()', function() {
        it('should return a valid ask response object', () => {
            let response = new AlexaResponse();
            response.ask('<speak>Hello</speak>', '<speak>Reprompt text</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(false);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');

            expect(responseObj.response.reprompt.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.reprompt.outputSpeech.ssml).to.have.string('<speak>Reprompt text</speak>');

            // without reprompt speech parameter
            response = new AlexaResponse();
            response.ask('Hello');
            responseObj = response.responseObj;
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');

            expect(responseObj.response.reprompt.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.reprompt.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');
        });
    });

    describe('play()', function() {
        it('should return a valid tell response object that plays a ssml audio', () => {
            let response = new AlexaResponse();
            response.play('https://www.example.com/audio.mp3');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.be.equal('<speak><audio src="https://www.example.com/audio.mp3"/></speak>');
        });
        it('should throw an error on non-https url', () => {
            let response = new AlexaResponse();
            expect(() => {
                response.play('http://www.example.com/audio.mp3');
            }).to.throw('Url must be https');
        });
    });

    describe('addSimpleCard()', function() {
        it('should return a valid tell response with a simple card', () => {
            let response = new AlexaResponse();
            response
                .addSimpleCard('Title', 'Content')
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');
            expect(responseObj.response.card.type).to.equal('Simple');
            expect(responseObj.response.card.title).to.equal('Title');
            expect(responseObj.response.card.content).to.equal('Content');
        });
    });

    describe('addStandardCard()', function() {
        it('should return a valid tell response with a standard card', () => {
            let response = new AlexaResponse();
            response
                .addStandardCard('Title',
                    'Text',
                    'https://www.example.com/smallImage.jpg',
                    'https://www.example.com/largeImage.jpg')
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');
            expect(responseObj.response.card.type).to.equal('Standard');
            expect(responseObj.response.card.title).to.equal('Title');
            expect(responseObj.response.card.text).to.equal('Text');
            expect(responseObj.response.card.image.smallImageUrl).to.equal('https://www.example.com/smallImage.jpg');
            expect(responseObj.response.card.image.largeImageUrl).to.equal('https://www.example.com/largeImage.jpg');
        });
        it('should throw an error on non-https url', () => {
            let response = new AlexaResponse();
            expect(() => {
                response.addStandardCard('Title',
                    'Text',
                    'http://www.example.com/smallImage.jpg',
                    'https://www.example.com/largeImage.jpg');
            }).to.throw('Url must be https');

            response = new AlexaResponse();
            expect(() => {
                response.addStandardCard('Title',
                    'Text',
                    'https://www.example.com/smallImage.jpg',
                    'http://www.example.com/largeImage.jpg');
            }).to.throw('Url must be https');

            response = new AlexaResponse();
            expect(() => {
                response.addStandardCard('Title',
                    'Text',
                    'http://www.example.com/smallImage.jpg',
                    'http://www.example.com/largeImage.jpg');
            }).to.throw('Url must be https');
        });
    });
    describe('addLinkAccountCard()', function() {
        it('should return a valid tell response with an LinkAccountCard card', () => {
            let response = new AlexaResponse();
            response
                .addLinkAccountCard()
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');
            expect(responseObj.response.card.type).to.equal('LinkAccount');
        });
    });
    describe('addAskForCountryAndPostalCodeCard()', function() {
        it('should return a valid tell response with an AskForCountryAndPostalCode card', () => {
            let response = new AlexaResponse();
            response
                .addAskForCountryAndPostalCodeCard()
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');
            expect(responseObj.response.card.type).to.equal('AskForPermissionsConsent');
            expect(responseObj.response.card.permissions[0]).to.equal('read::alexa:device:all:address:country_and_postal_code');
        });
    });

    describe('addAskForAddressCard()', function() {
        it('should return a valid tell response with an AskForAddress card', () => {
            let response = new AlexaResponse();
            response
                .addAskForAddressCard()
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');
            expect(responseObj.response.card.type).to.equal('AskForPermissionsConsent');
            expect(responseObj.response.card.permissions[0]).to.equal('read::alexa:device:all:address');
        });
    });


    describe('addAskForListPermissionCard(types)', function() {
        it('should return a valid tell response with a AskForListPermission card (write permission) ', () => {
            let response = new AlexaResponse();
            response
                .addAskForListPermissionCard(['write'])
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');

            expect(responseObj.response.card.type).to.equal('AskForPermissionsConsent');
            expect(responseObj.response.card.permissions[0]).to.equal('write::alexa:household:list');
        });
        it('should return a valid tell response with a AskForListPermission card (read permission) ', () => {
            let response = new AlexaResponse();
            response
                .addAskForListPermissionCard(['read'])
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');

            expect(responseObj.response.card.type).to.equal('AskForPermissionsConsent');
            expect(responseObj.response.card.permissions[0]).to.equal('read::alexa:household:list');
        });

        it('should return a valid tell response with a AskForListPermission card (read, write permission) ', () => {
            let response = new AlexaResponse();
            response
                .addAskForListPermissionCard(['read', 'write'])
                .tell('<speak>Hello</speak>');

            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(true);
            expect(responseObj.response.outputSpeech.type).to.equal('SSML');
            expect(responseObj.response.outputSpeech.ssml).to.have.string('<speak>Hello</speak>');

            expect(responseObj.response.card.type).to.equal('AskForPermissionsConsent');
            expect(responseObj.response.card.permissions[0]).to.equal('read::alexa:household:list');
            expect(responseObj.response.card.permissions[1]).to.equal('write::alexa:household:list');
        });
        it('should throw an invalid permission type error ', () => {
            let response = new AlexaResponse();
            expect(() => {
                response.addAskForListPermissionCard(['wrongpermission', 'write']);
            }).to.throw('Invalid permission type');
        });
    });

    describe('dialogDelegate()', function() {
        it('should return a valid Dialog.Delegate directive response', () => {
            let response = new AlexaResponse();
            response.dialogDelegate(); // TODO: test with updatedIntent
            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(false);
            expect(responseObj.response.directives).to.have.lengthOf(1);
            expect(responseObj.response.directives[0].type).to.equal('Dialog.Delegate');
        });
    });

    describe('dialogElicitSlot(slotToElicit, speechText)', function() {
        it('should return a valid Dialog.ElicitSlot directive response', () => {
            let response = new AlexaResponse();
            response.dialogElicitSlot('SlotName', 'Any speech text'); // TODO: test with updatedIntent
            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(false);
            expect(responseObj.response.directives).to.have.lengthOf(1);
            expect(responseObj.response.directives[0].type).to.equal('Dialog.ElicitSlot');
            expect(responseObj.response.directives[0].slotToElicit).to.equal('SlotName');
            expect(responseObj.response.outputSpeech.ssml).to.equal('<speak>Any speech text</speak>');
            expect(responseObj.response.reprompt.outputSpeech.ssml).to.equal('<speak>Any speech text</speak>');
        });
        it('should return a valid Dialog.ElicitSlot directive response with different reprompt speech', () => {
            let response = new AlexaResponse();
            response.dialogElicitSlot('SlotName', 'Any speech text', 'Another reprompt text'); // TODO: test with updatedIntent
            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(false);
            expect(responseObj.response.directives).to.have.lengthOf(1);
            expect(responseObj.response.directives[0].type).to.equal('Dialog.ElicitSlot');
            expect(responseObj.response.directives[0].slotToElicit).to.equal('SlotName');
            expect(responseObj.response.outputSpeech.ssml).to.equal('<speak>Any speech text</speak>');
            expect(responseObj.response.reprompt.outputSpeech.ssml).to.equal('<speak>Another reprompt text</speak>');
        });
    });

    describe('dialogConfirmSlot(slotToConfirm, speechText)', function() {
        it('should return a valid Dialog.ConfirmSlot directive response', () => {
            let response = new AlexaResponse();
            response.dialogConfirmSlot('SlotName', 'Any speech text'); // TODO: test with updatedIntent
            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(false);
            expect(responseObj.response.directives).to.have.lengthOf(1);
            expect(responseObj.response.directives[0].type).to.equal('Dialog.ConfirmSlot');
            expect(responseObj.response.directives[0].slotToConfirm).to.equal('SlotName');
            expect(responseObj.response.outputSpeech.ssml).to.equal('<speak>Any speech text</speak>');
        });
    });

    describe('dialogConfirmIntent(speech)', function() {
        it('should return a valid Dialog.ConfirmIntent directive response', () => {
            let response = new AlexaResponse();
            response.dialogConfirmIntent('Any speech text'); // TODO: test with updatedIntent
            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.shouldEndSession).to.be.equal(false);
            expect(responseObj.response.directives).to.have.lengthOf(1);
            expect(responseObj.response.directives[0].type).to.equal('Dialog.ConfirmIntent');
            expect(responseObj.response.outputSpeech.ssml).to.equal('<speak>Any speech text</speak>');
        });
    });

    describe('setOutputSpeech(speech)', function() {
        it('should return a valid outputSpeech object', () => {
            let response = new AlexaResponse();
            response.setOutputSpeech('Any speech text'); // TODO: test with updatedIntent
            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.outputSpeech.ssml).to.equal('<speak>Any speech text</speak>');
        });
    });

    describe('setRepromptOutputSpeech(speech)', function() {
        it('should return a valid reprompt outputSpeech object', () => {
            let response = new AlexaResponse();
            response.setRepromptOutputSpeech('Any reprompt speech text'); // TODO: test with updatedIntent
            let responseObj = response.responseObj;
            expect(responseObj.version).to.equal('1.0');
            expect(responseObj.response.reprompt.outputSpeech.ssml).to.equal('<speak>Any reprompt speech text</speak>');
        });
    });

    describe('setSessionAttribute(name, value)', function() {
        it('should set a session attribute in the response object', () => {
           let response = new AlexaResponse();
           response.setSessionAttribute('attributeName', 'attributeValue');
           response.setSessionAttribute('attributeName2', {value: 'value', value2: 'value2'});

           expect(response.responseObj.sessionAttributes.attributeName).to.equal('attributeValue');
           expect(response.responseObj.sessionAttributes.attributeName2).to.deep.include({value: 'value', value2: 'value2'});
        });
    });

    describe('setSessionAttributes()', function() {
        it('should set the session attributes variable', () => {
            let response = new AlexaResponse();
            let sessionAttributes = {
                attributeName: 'attributeValue',
                attributeName2: {
                    value: 'value',
                    value2: 'value2',
                },
            };
            response.setSessionAttributes(sessionAttributes);

            expect(response.responseObj.sessionAttributes.attributeName).to.equal('attributeValue');
            expect(response.responseObj.sessionAttributes.attributeName2).to.deep.include({value: 'value', value2: 'value2'});
        });
    });

    describe('getSessionAttribute()', function() {
        it('should get the session attribute', () => {
            let response = new AlexaResponse();
            let sessionAttributes = {
                attributeName: 'attributeValue',
                attributeName2: {
                    value: 'value',
                    value2: 'value2',
                },
            };
            response.setSessionAttributes(sessionAttributes);

            expect(response.responseObj.sessionAttributes.attributeName).to.equal('attributeValue');
            expect(response.responseObj.sessionAttributes.attributeName2).to.deep.include({value: 'value', value2: 'value2'});

            expect(response.getSessionAttribute('attributeName')).to.equal('attributeValue');
            expect(response.getSessionAttribute('attributeName2')).to.deep.include({value: 'value', value2: 'value2'});
        });
    });

    describe('getSessionAttributes()', function() {
        it('should get the session attributes variable', () => {
            let response = new AlexaResponse();
            let sessionAttributes = {
                attributeName: 'attributeValue',
                attributeName2: {
                    value: 'value',
                    value2: 'value2',
                },
            };
            response.setSessionAttributes(sessionAttributes);


            expect(response.getSessionAttributes()).to.deep.include({
                attributeName: 'attributeValue',
                attributeName2: {
                    value: 'value',
                    value2: 'value2',
                },
            });
        });
    });

    describe('getDirectives()', function() {
        it('should return the directives array', () => {
            let response = new AlexaResponse();
            response.dialogDelegate();
            let responseObj = response.responseObj;
            expect(responseObj.response.directives).to.have.lengthOf(1);
            expect(responseObj.response.directives[0].type).to.equal('Dialog.Delegate');
        });
    });

    describe('getResponseObject()', function() {
        it('should return the response object', () => {
           let response = new AlexaResponse();

           expect(response.responseObj).to.deep.include({
               version: '1.0',
               response: {
                   shouldEndSession: true,
               },
           });
        });
    });

    describe('getSpeechText()', function() {
        it('should return the speech text without the speak tags', () => {
            let response = new AlexaResponse();
            response.tell('HelloWorld');
            expect(response.getSpeechText()).to.equal('HelloWorld');

            response = new AlexaResponse();
            response.tell('<speak>HelloWorld</speak>');
            expect(response.getSpeechText()).to.equal('HelloWorld');
        });
    });

    describe('isEmptyResponse()', function() {
       it('should return true or false with different variations', () => {
            let response = new AlexaResponse();

            expect(response.isEmptyResponse()).to.equal(true);
            response = new AlexaResponse();
            response.tell('Test');
            expect(response.isEmptyResponse()).to.equal(false);
       });
    });

    describe('isTell()', function() {
        it('should return true on valid tell response', () => {
            let response = new AlexaResponse();
            response.tell('HelloWorld');

            expect(response.isTell('HelloWorld')).to.equal(true);
            expect(response.isTell()).to.equal(true);

            response = new AlexaResponse();
            response.tell();
            expect(response.isTell()).to.equal(true);
        });

        it('should return false on invalid tell response', () => {
            let response = new AlexaResponse();
            response.tell('HelloWorld');

            expect(response.isTell('Foobar')).to.equal(false);

            response = new AlexaResponse();
            response.ask('Foo', 'Bar');

            expect(response.isTell()).to.equal(false);
        });
    });

    describe('isAsk()', function() {
        it('should return true on valid ask response', () => {
            let response = new AlexaResponse();
            response.ask('Foo?', 'Bar?');

            expect(response.isAsk()).to.equal(true);
            expect(response.isAsk('Foo?')).to.equal(true);
            expect(response.isAsk('Foo?', 'Bar?')).to.equal(true);

            response = new AlexaResponse();
            response.ask('Foo?');

            expect(response.isAsk()).to.equal(true);
            expect(response.isAsk('Foo?')).to.equal(true);
            expect(response.isAsk('Foo?', 'Foo?')).to.equal(true);
        });
        it('should return false on invalid ask response', () => {
            let response = new AlexaResponse();
            response.tell('bla');

            expect(response.isAsk()).to.equal(false);

            response = new AlexaResponse();
            response.ask('Foo?');

            expect(response.isAsk('Foo!')).to.equal(false);
            expect(response.isAsk('Foo?', 'Foo!')).to.equal(false);

            response = new AlexaResponse();
            response.ask('Foo?', 'Bar?');

            expect(response.isAsk('Foo!')).to.equal(false);
            expect(response.isAsk('Foo?', 'Foo!')).to.equal(false);
            expect(response.isAsk('Foo!', 'Foo!')).to.equal(false);

            response = new AlexaResponse();
            response.dialogDelegate();

            expect(response.isAsk()).to.equal(false);
        });
    });

    describe('isPlay()', function() {
        it('should return true on valid play response', () => {
            let response = new AlexaResponse();
            response.play('https://www.example.com/audio.mp3');

            expect(response.isPlay('https://www.example.com/audio.mp3')).to.equal(true);
        });
        it('should return false on invalid play response', () => {
            let response = new AlexaResponse();
            response.play('https://www.example.com/audio.mp3');

            expect(response.isPlay('https://www.example.com/file.mp3')).to.equal(false);

            response = new AlexaResponse();
            response.tell('https://www.example.com/audio.mp3');

            expect(response.isPlay('https://www.example.com/audio.mp3')).to.equal(false);
        });
    });

    describe('hasSimpleCard()', function() {
        it('should return true on valid tell/ask response with a simple card', () => {
            let response = new AlexaResponse();
            response.addSimpleCard('Title', 'Content').tell('Hello');

            expect(response.hasSimpleCard()).to.equal(true);
            expect(response.hasSimpleCard('Title')).to.equal(true);
            expect(response.hasSimpleCard('Title', 'Content')).to.equal(true);

            // same with ask
            response = new AlexaResponse();
            response.addSimpleCard('Title', 'Content').ask('Foo?', 'Bar?');

            expect(response.hasSimpleCard()).to.equal(true);
            expect(response.hasSimpleCard('Title')).to.equal(true);
            expect(response.hasSimpleCard('Title', 'Content')).to.equal(true);
        });
        it('should return false on a response with an invalid simple card ', () => {
            let response = new AlexaResponse();
            response.tell('Hello');

            expect(response.hasSimpleCard()).to.equal(false);

            response = new AlexaResponse();
            response.addStandardCard(
                'title',
                'content',
                'https://www.example.com/smallImage.jpg',
                'https://www.example.com/largeImage.jpg'
                )
                .tell('Hello');

            expect(response.hasSimpleCard()).to.equal(false);

            response = new AlexaResponse();
            response.ask('Foo?', 'Bar?');

            expect(response.hasSimpleCard()).to.equal(false);

            response = new AlexaResponse();
            response.addSimpleCard('Title', 'Content').tell();

            expect(response.hasSimpleCard('NoTitle')).to.equal(false);
            expect(response.hasSimpleCard('Title', 'NoContent')).to.equal(false);
        });
    });

    describe('hasStandardCard()', function() {
        it('should return true on valid tell/ask response with a standard card', () => {
            let response = new AlexaResponse();
            response.addStandardCard(
                'Title',
                'Content',
                'https://www.example.com/smallImage.jpg',
                'https://www.example.com/largeImage.jpg'
            ).tell('Hello');

            expect(response.hasStandardCard()).to.equal(true);
            expect(response.hasStandardCard('Title')).to.equal(true);
            expect(response.hasStandardCard('Title', 'Content')).to.equal(true);
            expect(response.hasStandardCard('Title', 'Content', 'https://www.example.com/smallImage.jpg')).to.equal(true);
            expect(response.hasStandardCard('Title', 'Content', 'https://www.example.com/smallImage.jpg', 'https://www.example.com/largeImage.jpg')).to.equal(true);
        });

        it('should return false on a response with an invalid standard card ', () => {
            let response = new AlexaResponse();
            response.tell('Hello');

            expect(response.hasStandardCard()).to.equal(false);

            response = new AlexaResponse();
            response.addSimpleCard(
                'title',
                'content'
            )
                .tell('Hello');

            expect(response.hasStandardCard()).to.equal(false);

            response = new AlexaResponse();
            response.addStandardCard(
                'Title',
                'Content',
                'https://www.example.com/smallImage.jpg',
                'https://www.example.com/largeImage.jpg'
            ).tell('Hello');
            //
            expect(response.hasStandardCard('NoTitle')).to.equal(false);
            expect(response.hasStandardCard('Title', 'NoContent')).to.equal(false);
            expect(response.hasStandardCard('Title', 'Content', 'wrong image')).to.equal(false);
            expect(response.hasStandardCard('Title', 'Content', 'https://www.example.com/smallImage.jpg', 'wrong image')).to.equal(false);
        });
    });

    describe('hasLinkAccountCard()', function() {
        it('should return true on valid tell/ask response with a link account card', () => {
            let response = new AlexaResponse();
            response.addLinkAccountCard().tell('Hello');

            expect(response.hasLinkAccountCard()).to.equal(true);
            response = new AlexaResponse();
            response.tell('Hello');

            expect(response.hasLinkAccountCard()).to.equal(false);
        });
    });

    describe('hasAskForAddressCard()', function() {
        it('should return true on valid tell/ask response with a ask for address card', () => {
            let response = new AlexaResponse();
            response.addAskForAddressCard().tell('Hello');

            expect(response.hasAskForAddressCard()).to.equal(true);
            response = new AlexaResponse();
            response.tell('Hello');

            expect(response.hasAskForAddressCard()).to.equal(false);

            response = new AlexaResponse();
            response.addAskForCountryAndPostalCodeCard().tell('Hello');

            expect(response.hasAskForAddressCard()).to.equal(false);
        });
    });

    describe('hasAskForCountryAndPostalCodeCard()', function() {
        it('should return true on valid tell/ask response with a ask for country and postal code card', () => {
            let response = new AlexaResponse();
            response.addAskForCountryAndPostalCodeCard().tell('Hello');

            expect(response.hasAskForCountryAndPostalCodeCard()).to.equal(true);
            response = new AlexaResponse();
            response.tell('Hello');

            expect(response.hasAskForCountryAndPostalCodeCard()).to.equal(false);

            response = new AlexaResponse();
            response.addSimpleCard('Test', 'Test').tell('Hello');

            expect(response.hasAskForCountryAndPostalCodeCard()).to.equal(false);
        });
    });

    describe('hasAskForListPermissionCard()', function() {
        it('should return true on valid tell/ask response with a ask for list permission card', () => {
            let response = new AlexaResponse();
            response.addAskForListPermissionCard(['write', 'read']).tell('Hello');

            expect(response.hasAskForListPermissionCard()).to.equal(true);
            expect(response.hasAskForListPermissionCard('read')).to.equal(true);
            expect(response.hasAskForListPermissionCard('write')).to.equal(true);
            expect(response.hasAskForListPermissionCard('read', 'write')).to.equal(true);

            response = new AlexaResponse();
            response.addAskForCountryAndPostalCodeCard().tell('Hello');

            expect(response.hasAskForListPermissionCard()).to.equal(false);
        });
    });

    describe('isDialogDirective()', function() {
        it('should return true on valid dialog directive response', () => {
            let response = new AlexaResponse();
            response.dialogDelegate();

            expect(response.isDialogDirective()).to.equal(true);
            expect(response.isDialogDirective('Dialog.Delegate')).to.equal(true);
        });
        it('should return false on invalid dialog directive response', () => {
            let response = new AlexaResponse();
            response.tell('Hello');

            expect(response.isDialogDirective()).to.equal(false);

            response = new AlexaResponse();
            response.addHintDirective('Hint').tell('Hello');

            expect(response.isDialogDirective()).to.equal(false);
        });
    });

    describe('isDialogDelegate()', function() {
        it('should return true on valid dialog delegate directive response', () => {
            let response = new AlexaResponse();
            response.dialogDelegate();
            expect(response.isDialogDelegate()).to.equal(true);
        });
        it('should return false on invalid dialog delegate directive response', () => {
            let response = new AlexaResponse();
            response.dialogElicitSlot('slotName', 'speechText');
            expect(response.isDialogDelegate()).to.equal(false);
        });
    });

    describe('isDialogElicitSlot()', function() {
        it('should return true on valid dialog elicit slot directive response', () => {
            let response = new AlexaResponse();
            response.dialogElicitSlot('SlotName', 'speechText', 'repromptSpeech');
            expect(response.isDialogElicitSlot()).to.equal(true);
            expect(response.isDialogElicitSlot('SlotName')).to.equal(true);
            expect(response.isDialogElicitSlot('SlotName', 'speechText')).to.equal(true);
            expect(response.isDialogElicitSlot('SlotName', 'speechText', 'repromptSpeech')).to.equal(true);
        });
        it('should return false on invalid dialog elicit slot directive response', () => {
            let response = new AlexaResponse();
            response.dialogDelegate();
            expect(response.isDialogElicitSlot()).to.equal(false);

            response = new AlexaResponse();
            response.dialogElicitSlot('SlotName', 'speechText', 'repromptSpeech');
            expect(response.isDialogElicitSlot('WrongSlotName')).to.equal(false);
            expect(response.isDialogElicitSlot('SlotName', 'WrongSpeechText')).to.equal(false);
            expect(response.isDialogElicitSlot('SlotName', 'SpeechText', 'WrongRepromptSpeech')).to.equal(false);
        });
    });

    describe('isDialogConfirmSlot()', function() {
        it('should return true on valid dialog confirm slot directive response', () => {
            let response = new AlexaResponse();
            response.dialogConfirmSlot('SlotName', 'speechText', 'repromptSpeech');
            expect(response.isDialogConfirmSlot()).to.equal(true);
            expect(response.isDialogConfirmSlot('SlotName')).to.equal(true);
            expect(response.isDialogConfirmSlot('SlotName', 'speechText')).to.equal(true);
            expect(response.isDialogConfirmSlot('SlotName', 'speechText', 'repromptSpeech')).to.equal(true);
        });
        it('should return false on invalid dialog confirm slot directive response', () => {
            let response = new AlexaResponse();
            response.dialogDelegate();
            expect(response.isDialogConfirmSlot()).to.equal(false);

            response = new AlexaResponse();
            response.dialogConfirmSlot('SlotName', 'speechText', 'repromptSpeech');
            expect(response.isDialogConfirmSlot('WrongSlotName')).to.equal(false);
            expect(response.isDialogConfirmSlot('SlotName', 'WrongSpeechText')).to.equal(false);
            expect(response.isDialogConfirmSlot('SlotName', 'SpeechText', 'WrongRepromptSpeech')).to.equal(false);
        });
    });

    describe('isDialogConfirmIntent()', function() {
        it('should return true on valid dialog confirm intent directive response', () => {
            let response = new AlexaResponse();
            response.dialogConfirmIntent('speechText', 'repromptSpeech');
            expect(response.isDialogConfirmIntent()).to.equal(true);
            expect(response.isDialogConfirmIntent('speechText')).to.equal(true);
            expect(response.isDialogConfirmIntent('speechText', 'repromptSpeech')).to.equal(true);
        });
        it('should return false on invalid dialog confirm intent directive response', () => {
            let response = new AlexaResponse();
            response.dialogDelegate();
            expect(response.isDialogConfirmIntent()).to.equal(false);

            response = new AlexaResponse();
            response.dialogConfirmIntent('speechText', 'repromptSpeech');

            expect(response.isDialogConfirmIntent('WrongSpeechText')).to.equal(false);
            expect(response.isDialogConfirmIntent('speechText', 'WrongRepromptSpeech')).to.equal(false);
        });
    });

    describe('hasSessionAttribute(name, value)', function() {
        it('should return true if attribute exists in session attributes variable', () => {
            let response = new AlexaResponse();
            response.setSessionAttribute('attributeName', 'attributeValue');
            expect(response.hasSessionAttribute('attributeName')).to.equal(true);
            expect(response.hasSessionAttribute('attributeName', 'attributeValue')).to.equal(true);
        });
        it('should return false if attribute doesn\'t exist in session attributes variable', () => {
            let response = new AlexaResponse();
            expect(response.hasSessionAttribute('attributeName')).to.equal(false);

            response = new AlexaResponse();
            response.setSessionAttribute('attributeName', 'attributeValue');
            expect(response.hasSessionAttribute('attributeNameABC')).to.equal(false);
            expect(response.hasSessionAttribute('attributeName', 'wrongValue')).to.equal(false);
        });
    });

    describe('hasState(state)', function() {
       it('should return true or false on different variations', () => {
           let response = new AlexaResponse();
           response.setSessionAttribute('STATE', 'State1');
           expect(response.hasState('State1')).to.equal(true);
           expect(response.hasState('State2')).to.equal(false);
       });
    });
    describe('speechTextContains()', function() {
        it('should return true or false on different variations', () => {
            let response = new AlexaResponse();
            response.tell('This is a test');

            expect(response.speechTextContains('is a')).to.equal(true);
            expect(response.speechTextContains('is bla')).to.equal(false);
            expect(response.speechTextContains('This is a test')).to.equal(true);
            expect(response.speechTextContains()).to.equal(false);
            expect(response.speechTextContains(['Bar', 'Foo'])).to.equal(false);
            expect(response.speechTextContains(['Bar', 'test'])).to.equal(true);
        });
    });


    describe('addDisplayRenderTemplateDirective(template)', function() {
        it('should return a valid hint directive response', () => {
            let response = new AlexaResponse();
            let template = new BodyTemplate1()
                .setTitle('Hello World')
                .setToken('tokenXYZ')
                .setTextContent('primary', 'secondary');

            response.addDisplayRenderTemplateDirective(template);
            expect(response.responseObj.response.directives).to.deep.include({
                type: 'Display.RenderTemplate',
                template: {
                    type: 'BodyTemplate1',
                    title: 'Hello World',
                    token: 'tokenXYZ',
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary',
                        },
                    },
                },
            });
        });

        it('should return a valid response with more than one directives', () => {
            let response = new AlexaResponse();
            let template = new BodyTemplate1()
                .setTitle('Hello World')
                .setToken('tokenXYZ')
                .setTextContent('primary', 'secondary');

            response.addDisplayRenderTemplateDirective(template);
            response.addHintDirective('Hint text').tell('Hello World');
            expect(response.responseObj.response.directives).to.deep.include({
                type: 'Hint',
                hint: {
                    type: 'PlainText',
                    text: 'Hint text',
                },
            });
            expect(response.responseObj.response.directives).to.deep.include({
                type: 'Display.RenderTemplate',
                template: {
                    type: 'BodyTemplate1',
                    title: 'Hello World',
                    token: 'tokenXYZ',
                    textContent: {
                        primaryText: {
                            type: 'RichText',
                            text: 'primary',
                        },
                        secondaryText: {
                            type: 'RichText',
                            text: 'secondary',
                        },
                    },
                },
            });
        });
    });

    describe('addHintDirective(text)', function() {
        it('should return a valid hint directive response', () => {
            let response = new AlexaResponse();
            response.addHintDirective('Hint text').tell('Hello World');
            expect(response.responseObj.response.directives).to.deep.include({
                type: 'Hint',
                hint: {
                    type: 'PlainText',
                    text: 'Hint text',
                },
            });
        });
    });

    describe('addVideoDirective(url, title, subtitle)', function() {
        it('should return a valid add video directive', () => {
            let response = new AlexaResponse();
            response
                .addVideoDirective('https://www.example.com/video.mp4', 'Title', 'Subtitle', 'Preamble');

            expect(response.getSpeechText()).to.equal('Preamble');
            expect(response.responseObj.response.directives).to.deep.include({
                type: 'VideoApp.Launch',
                videoItem: {
                    source: 'https://www.example.com/video.mp4',
                    metadata: {
                        title: 'Title',
                        subtitle: 'Subtitle',
                    },
                },
            });

            response = new AlexaResponse();
            response
                .addVideoDirective('https://www.example.com/video.mp4', 'Title', 'Subtitle');

            expect(response.responseObj.response.directives).to.deep.include({
                type: 'VideoApp.Launch',
                videoItem: {
                    source: 'https://www.example.com/video.mp4',
                    metadata: {
                        title: 'Title',
                        subtitle: 'Subtitle',
                    },
                },
            });

            response = new AlexaResponse();
            response
                .addVideoDirective('https://www.example.com/video.mp4', 'Title');

            expect(response.responseObj.response.directives).to.deep.include({
                type: 'VideoApp.Launch',
                videoItem: {
                    source: 'https://www.example.com/video.mp4',
                    metadata: {
                        title: 'Title',
                    },
                },
            });

            response = new AlexaResponse();
            response
                .addVideoDirective('https://www.example.com/video.mp4');

            expect(response.responseObj.response.directives).to.deep.include({
                type: 'VideoApp.Launch',
                videoItem: {
                    source: 'https://www.example.com/video.mp4',
                },
            });

            response = new AlexaResponse();
            response
                .addVideoDirective('https://www.example.com/video.mp4');

            expect(() => {
                response
                    .addVideoDirective('http://www.example.com/video.mp4');
            }).to.throw('Url must be https');
        });
    });

    describe('audioPlayerPlay(playBehavior, audioItem)', function() {
        it('should return a valid audioplayer play directive response', () => {
            let response = new AlexaResponse();
            response.audioPlayerPlay('REPLACE_ALL', {
                stream: {
                    token: 'audio-token',
                    url: 'https://www.example.com/audio.mp3',
                    offsetInMilliseconds: 123,
                },
            });
            expect(response.responseObj.response.directives).to.deep.include({
                type: 'AudioPlayer.Play',
                playBehavior: 'REPLACE_ALL',
                audioItem: {
                    stream: {
                        token: 'audio-token',
                        url: 'https://www.example.com/audio.mp3',
                        offsetInMilliseconds: 123,
                    },
                },
            });
        });
    });
    describe('audioPlayerClearQueue(url, title, subtitle)', function() {

    });
    describe('audioPlayerStop(url, title, subtitle)', function() {

    });

    describe('shouldEndSession(endSession)', function() {

    });

    describe('deleteShouldEndSession(url, title, subtitle)', function() {

    });
});

