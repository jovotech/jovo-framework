'use strict';
const expect = require('chai').expect;
const LaunchRequest = require('./../../../lib/platforms/alexa/request/launchRequest').LaunchRequest;

const AlexaRequestBuilder = require('../../../lib/platforms/alexa/request/util/requestBuilder').RequestBuilder;
const launchSample = require('./../../../lib/platforms/alexa/request/samples/launchRequestSample.json');

describe('Alexa Request Builder', function() {
    it('launchRequest()', function() {
        let launchRequest = AlexaRequestBuilder.launchRequest();
        expect(launchRequest).to.deep.equal(launchSample);
        expect(launchRequest).to.be.instanceOf(LaunchRequest);

        const launchRequestSample = {
            'version': '1.0',
            'session': {
                'new': true,
                'sessionId': 'ANY-ID',
                'application': {
                    'applicationId': 'ANY-ID',
                },
                'attributes': {},
                'user': {
                    'userId': 'ANY-ID',
                },
            },
            'context': {
                'System': {
                    'application': {
                        'applicationId': 'ANY-ID',
                    },
                    'user': {
                        'userId': 'ANY-ID',
                    },
                    'device': {
                        'supportedInterfaces': {
                            'AudioPlayer': {},
                        },
                    },
                },
                'AudioPlayer': {
                    'offsetInMilliseconds': 0,
                    'playerActivity': 'IDLE',
                },
            },
            'request': {
                'type': 'LaunchRequest',
                'requestId': 'ANY-ID',
                'timestamp': '2015-05-13T12:34:56Z',
                'locale': 'string',
            },
        };


        let launchRequest2 = AlexaRequestBuilder.launchRequest(launchRequestSample);

        expect(launchRequest2).to.deep.equal(launchRequestSample);
        expect(launchRequest2).to.be.instanceOf(LaunchRequest);
    });
});

