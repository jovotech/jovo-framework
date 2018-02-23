'use strict';
const expect = require('chai').expect;
const LaunchRequest = require('../../../lib/platforms/alexaSkill/request/launchRequest').LaunchRequest;
const IntentRequest = require('../../../lib/platforms/alexaSkill/request/intentRequest').IntentRequest;
const SessionEndedRequest = require('../../../lib/platforms/alexaSkill/request/sessionEndedRequest').SessionEndedRequest;
const ErrorRequest = require('../../../lib/platforms/alexaSkill/request/errorRequest').ErrorRequest;
const AudioPlayerRequest = require('../../../lib/platforms/alexaSkill/request/audioPlayerRequest').AudioPlayerRequest;


const AlexaRequestBuilder = require('../../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;
const launchSample = require('../../../lib/platforms/alexaSkill/request/samples/launchRequestSample.json');
const intentSample = require('../../../lib/platforms/alexaSkill/request/samples/intentRequestSample.json');
const sessionEndedSample = require('../../../lib/platforms/alexaSkill/request/samples/sessionEndedRequestSample.json');
const errorSample = require('../../../lib/platforms/alexaSkill/request/samples/errorRequestSample.json');
const audioPlayerSample = require('../../../lib/platforms/alexaSkill/request/samples/audioPlayerRequestSample1.json');


describe('Alexa Request Builder', function() {
    it('launchRequest()', function() {
        let launchRequest = AlexaRequestBuilder.launchRequest();
        expect(launchRequest).to.deep.equal(launchSample);
        expect(launchRequest).to.be.instanceOf(LaunchRequest);
    });
    it('launchRequest(request)', function() {
        let launchRequest2 = AlexaRequestBuilder.launchRequest(launchSample);
        expect(launchRequest2).to.deep.equal(launchSample);
        expect(launchRequest2).to.be.instanceOf(LaunchRequest);
    });

    it('intentRequest()', function() {
        let intentRequest = AlexaRequestBuilder.intentRequest();
        expect(intentRequest).to.deep.equal(intentSample);
        expect(intentRequest).to.be.instanceOf(IntentRequest);
    });
    it('intentRequest(request)', function() {
        let intentRequest2 = AlexaRequestBuilder.intentRequest(intentSample);
        expect(intentRequest2).to.deep.equal(intentSample);
        expect(intentRequest2).to.be.instanceOf(IntentRequest);
    });

    it('sessionEndedRequest()', function() {
        let sessionEndedRequest = AlexaRequestBuilder.sessionEndedRequest();
        expect(sessionEndedRequest).to.deep.equal(sessionEndedSample);
        expect(sessionEndedRequest).to.be.instanceOf(SessionEndedRequest);
    });
    it('sessionEndedRequest(request)', function() {
        let sessionEndedRequest = AlexaRequestBuilder.sessionEndedRequest(sessionEndedSample);
        expect(sessionEndedRequest).to.deep.equal(sessionEndedSample);
        expect(sessionEndedRequest).to.be.instanceOf(SessionEndedRequest);
    });

    it('errorRequest()', function() {
        let errorRequest = AlexaRequestBuilder.errorRequest();
        expect(errorRequest).to.deep.equal(errorSample);
        expect(errorRequest).to.be.instanceOf(ErrorRequest);
    });
    it('errorRequest(request)', function() {
        let errorRequest = AlexaRequestBuilder.errorRequest(errorSample);
        expect(errorRequest).to.deep.equal(errorSample);
        expect(errorRequest).to.be.instanceOf(ErrorRequest);
    });
    it('audioPlayerRequest()', function() {
        let audioPlayerRequest = AlexaRequestBuilder.audioPlayerRequest();
        expect(audioPlayerRequest).to.deep.equal(audioPlayerRequest);
        expect(audioPlayerRequest).to.be.instanceOf(AudioPlayerRequest);
    });
    it('audioPlayerRequest(request)', function() {
        let audioPlayerRequest = AlexaRequestBuilder.audioPlayerRequest(audioPlayerSample);
        expect(audioPlayerRequest).to.deep.equal(audioPlayerRequest);
        expect(audioPlayerRequest).to.be.instanceOf(AudioPlayerRequest);
    });
});

