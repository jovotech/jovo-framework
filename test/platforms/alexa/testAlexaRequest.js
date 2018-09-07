'use strict';
const expect = require('chai').expect;
const AlexaRequestBuilder = require('../../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;
const launchRequestSample = require('../../../lib/platforms/alexaSkill/request/samples/launchRequestSample.json');
const intentRequestSample = require('../../../lib/platforms/alexaSkill/request/samples/intentRequestSample.json');

const sessionEndedRequestSample = require('../../../lib/platforms/alexaSkill/request/samples/sessionEndedRequestSample.json');
const audioPlayerRequestSample1 = require('../../../lib/platforms/alexaSkill/request/samples/audioPlayerRequestSample1.json');
const errorRequestSample = require('../../../lib/platforms/alexaSkill/request/samples/errorRequestSample.json');

const LaunchRequest = require('../../../lib/platforms/alexaSkill/request/launchRequest').LaunchRequest;
const IntentRequest = require('../../../lib/platforms/alexaSkill/request/intentRequest').IntentRequest;
const SessionEndedRequest = require('../../../lib/platforms/alexaSkill/request/sessionEndedRequest').SessionEndedRequest;
const AudioPlayerRequest = require('../../../lib/platforms/alexaSkill/request/audioPlayerRequest').AudioPlayerRequest;
const ErrorRequest = require('../../../lib/platforms/alexaSkill/request/errorRequest').ErrorRequest;

describe('Tests for AlexaRequest Class', function() {
    it('constructor()', function() {
        let launchRequest = AlexaRequestBuilder.launchRequest();
        let launchRequest2 = new LaunchRequest(launchRequestSample);
        let intentRequest = AlexaRequestBuilder.intentRequest();
        let intentRequest2 = new IntentRequest(intentRequestSample);
        let sessionEndedRequest = AlexaRequestBuilder.sessionEndedRequest();
        let sessionEndedRequest2 = new SessionEndedRequest(sessionEndedRequestSample);
        let audioPlayerRequest = AlexaRequestBuilder.audioPlayerRequest();
        let audioPlayerRequest2 = new AudioPlayerRequest(audioPlayerRequestSample1);
        let errorRequest = AlexaRequestBuilder.errorRequest();
        let errorRequest2 = new ErrorRequest(errorRequestSample);

        expect(launchRequest).to.be.instanceOf(LaunchRequest);
        expect(launchRequest2).to.be.instanceOf(LaunchRequest);
        expect(intentRequest).to.be.instanceOf(IntentRequest);
        expect(intentRequest2).to.be.instanceOf(IntentRequest);
        expect(sessionEndedRequest).to.be.instanceOf(SessionEndedRequest);
        expect(sessionEndedRequest2).to.be.instanceOf(SessionEndedRequest);
        expect(audioPlayerRequest).to.be.instanceOf(AudioPlayerRequest);
        expect(audioPlayerRequest2).to.be.instanceOf(AudioPlayerRequest);
        expect(errorRequest).to.be.instanceOf(ErrorRequest);
        expect(errorRequest2).to.be.instanceOf(ErrorRequest);
    });

    it('LaunchRequest getter', function() {
        let launchRequest = AlexaRequestBuilder.launchRequest();

        // request
        expect(launchRequest.getVersion()).to.be.equal('1.0');
        expect(launchRequest.getType()).to.be.equal('LaunchRequest');
        expect(launchRequest.getRequestId()).to.be.equal('amzn1.echo-api.request.0000000-0000-0000-0000-00000000000');
        expect(launchRequest.getTimestamp()).to.be.equal('2015-05-13T12:34:56Z');
        expect(launchRequest.getLocale()).to.be.equal('en-US');

        // session
        expect(launchRequest.getSessionNew()).to.be.equal(true);
        expect(launchRequest.getSessionId()).to.be.equal('amzn1.echo-api.session.0000000-0000-0000-0000-00000000000');
        expect(launchRequest.getApplicationId()).to.be.equal('amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe');
        expect(launchRequest.getUserId()).to.be.equal('amzn1.account.AM3B00000000000000000000000');

        // context
        expect(launchRequest.getSupportedInterfaces()).to.deep.equal({'AudioPlayer': {}});
        expect(launchRequest.getAudioPlayerActivity()).to.be.equal('IDLE');
        expect(launchRequest.getAudioPlayerOffsetInMilliseconds()).to.be.equal(0);
        expect(launchRequest.getDeviceId()).to.be.equal('amzn1.ask.device.XXXXXA6LX6BOBJF6XNWQM2ZO4NVVGZRFFEL6PMXKWLOHI36IY3B4XCSZKZPR42RAWCBSQEDNGS746OCC2PKR5KDIVAUY6F2DX5GV2SQAXPD7GMKQRWLG4LFKXFPVLVTXHFGLCQKHB7ZNBKLHQU4SJG6NNGA');
    });
    it('LaunchRequest setter', function() {
        const launchRequest = AlexaRequestBuilder.launchRequest();

        launchRequest
            .setVersion('2.0')
            .setType('AnotherTest')
            .setRequestId('RandomRequestId')
            .setTimestamp('2017-01-01T00:00:00Z')
            .setLocale('de-DE')
            .setSessionNew(false)
            .setSessionId('RandomSessionid')
            .setApplicationId('RandomApplicationId')
            .setUserId('RandomUserId')
            .setDeviceId('RandomDeviceId')
            .setSupportedInterfaces({'VideoPlayer': {}})
            .setAudioPlayerActivity('PLAYING')
            .setAudioPlayerOffsetInMilliseconds(1000);


        let result = {
            'version': '2.0',
            'session': {
                'new': false,
                'sessionId': 'RandomSessionid',
                'application': {
                    'applicationId': 'RandomApplicationId',
                },
                'attributes': {},
                'user': {
                    'userId': 'RandomUserId',
                },
            },
            'context': {
                'System': {
                    'application': {
                        'applicationId': 'RandomApplicationId',
                    },
                    'user': {
                        'userId': 'RandomUserId',
                    },
                    'device': {
                        'deviceId': 'RandomDeviceId',
                        'supportedInterfaces': {
                            'VideoPlayer': {},
                        },
                    },
                },
                'AudioPlayer': {
                    'offsetInMilliseconds': 1000,
                    'playerActivity': 'PLAYING',
                },
            },
            'request': {
                'type': 'AnotherTest',
                'requestId': 'RandomRequestId',
                'timestamp': '2017-01-01T00:00:00Z',
                'locale': 'de-DE',
            },
        };
        expect(launchRequest).to.deep.equal(result);
    });
    it('IntentRequest getter', function() {
        const intentRequest = AlexaRequestBuilder.intentRequest(intentRequestSample);

        // request
        expect(intentRequest.getVersion()).to.be.equal('1.0');
        expect(intentRequest.getType()).to.be.equal('IntentRequest');
        expect(intentRequest.getRequestId()).to.be.equal('amzn1.echo-api.request.0000000-0000-0000-0000-00000000000');
        expect(intentRequest.getTimestamp()).to.be.equal('2015-05-13T12:34:56Z');
        expect(intentRequest.getLocale()).to.be.equal('en-US');

        // intent
        expect(intentRequest.getDialogState()).to.be.equal('COMPLETED');
        expect(intentRequest.getIntentName()).to.be.equal('HelpIntent');
        expect(intentRequest.getIntentConfirmationStatus()).to.be.equal('NONE');

        // session
        expect(intentRequest.getSessionNew()).to.be.equal(false);
        expect(intentRequest.getSessionId()).to.be.equal('amzn1.echo-api.session.0000000-0000-0000-0000-00000000000');
        expect(intentRequest.getApplicationId()).to.be.equal('amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe');
        expect(intentRequest.getUserId()).to.be.equal('amzn1.account.AM3B00000000000000000000000');

        // context
        expect(intentRequest.getSupportedInterfaces()).to.deep.equal({'AudioPlayer': {}});
        expect(intentRequest.getAudioPlayerActivity()).to.be.equal('IDLE');
        expect(intentRequest.getAudioPlayerOffsetInMilliseconds()).to.be.equal(0);
        expect(intentRequest.getDeviceId()).to.be.equal('amzn1.ask.device.XXXXXA6LX6BOBJF6XNWQM2ZO4NVVGZRFFEL6PMXKWLOHI36IY3B4XCSZKZPR42RAWCBSQEDNGS746OCC2PKR5KDIVAUY6F2DX5GV2SQAXPD7GMKQRWLG4LFKXFPVLVTXHFGLCQKHB7ZNBKLHQU4SJG6NNGA');
    });

    it('IntentRequest setter', function() {
        const intentRequest = AlexaRequestBuilder.intentRequest();

        intentRequest
            .setVersion('2.0')
            .setType('AnotherTest')
            .setRequestId('RandomRequestId')
            .setTimestamp('2017-01-01T00:00:00Z')
            .setLocale('de-DE')
            .setSessionNew(true)
            .setSessionId('RandomSessionid')
            .setApplicationId('RandomApplicationId')
            .setUserId('RandomUserId')
            .setDeviceId('RandomDeviceId')
            .setSupportedInterfaces({'VideoPlayer': {}})
            .setAudioPlayerActivity('PLAYING')
            .setAudioPlayerOffsetInMilliseconds(1000)
            .setDialogState('STARTED')
            .setIntentName('IntentABC')
            .setIntentConfirmationStatus('CONFIRMED')
            .setSlots({
                'ZodiacSignABC': {
                    'name': 'ZodiacSignABC',
                    'value': 'virgoABC',
                    'confirmationStatus': 'NONE',
                },
                'ZodiacSignDEF': {
                    'name': 'ZodiacSignDEF',
                    'value': 'virgoDEF',
                    'confirmationStatus': 'CONFIRMED',
                },
            })
            .setSessionAttributes({
                'supportedHoroscopePeriodsABC': {
                    'daily': false,
                    'weekly': true,
                    'monthly': true,
                }});


        let result = {
                'version': '2.0',
                'session': {
                    'new': true,
                    'sessionId': 'RandomSessionid',
                    'application': {
                        'applicationId': 'RandomApplicationId',
                    },
                    'attributes': {
                        'supportedHoroscopePeriodsABC': {
                            'daily': false,
                            'weekly': true,
                            'monthly': true,
                        },
                    },
                    'user': {
                        'userId': 'RandomUserId',
                    },
                },
                'context': {
                    'System': {
                        'application': {
                            'applicationId': 'RandomApplicationId',
                        },
                        'user': {
                            'userId': 'RandomUserId',
                        },
                        'device': {
                            'deviceId': 'RandomDeviceId',
                            'supportedInterfaces': {
                                'VideoPlayer': {},
                            },
                        },
                    },
                    'AudioPlayer': {
                        'offsetInMilliseconds': 1000,
                        'playerActivity': 'PLAYING',
                    },
                },
                'request': {
                    'type': 'AnotherTest',
                    'requestId': 'RandomRequestId',
                    'timestamp': '2017-01-01T00:00:00Z',
                    'dialogState': 'STARTED',
                    'locale': 'de-DE',
                    'intent': {
                        'name': 'IntentABC',
                        'confirmationStatus': 'CONFIRMED',
                        'slots': {
                            'ZodiacSignABC': {
                                'name': 'ZodiacSignABC',
                                'value': 'virgoABC',
                                'confirmationStatus': 'NONE',
                            },
                            'ZodiacSignDEF': {
                                'name': 'ZodiacSignDEF',
                                'value': 'virgoDEF',
                                'confirmationStatus': 'CONFIRMED',
                            },
                        },
                    },
                },
            }
        ;
        expect(intentRequest).to.deep.equal(result);
    });
    it('SessionEndedRequest getter', function() {
        const sessionEndedRequest = AlexaRequestBuilder.sessionEndedRequest();

        // request
        expect(sessionEndedRequest.getVersion()).to.be.equal('1.0');
        expect(sessionEndedRequest.getType()).to.be.equal('SessionEndedRequest');
        expect(sessionEndedRequest.getRequestId()).to.be.equal('amzn1.echo-api.request.0000000-0000-0000-0000-00000000000');
        expect(sessionEndedRequest.getTimestamp()).to.be.equal('2015-05-13T12:34:56Z');
        expect(sessionEndedRequest.getLocale()).to.be.equal('en-US');
        expect(sessionEndedRequest.getReason()).to.be.equal('USER_INITIATED');

        // session
        expect(sessionEndedRequest.getSessionNew()).to.be.equal(false);
        expect(sessionEndedRequest.getSessionId()).to.be.equal('amzn1.echo-api.session.0000000-0000-0000-0000-00000000000');
        expect(sessionEndedRequest.getApplicationId()).to.be.equal('amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe');
        expect(sessionEndedRequest.getUserId()).to.be.equal('amzn1.account.AM3B00000000000000000000000');

        // context
        expect(sessionEndedRequest.getSupportedInterfaces()).to.deep.equal({'AudioPlayer': {}});
        expect(sessionEndedRequest.getAudioPlayerActivity()).to.be.equal('IDLE');
        expect(sessionEndedRequest.getAudioPlayerOffsetInMilliseconds()).to.be.equal(0);
        expect(sessionEndedRequest.getDeviceId()).to.be.equal('amzn1.ask.device.AEDKJQQ537N7576QKTYJDBGY775ELDXYAYRGNC2FBYJJDVHSDUEXOIXQ4CPRNKT3AN4AIWUQSKLYNJVE676UCP4ZUZVSAXXQ3UL6XP6SQCW2DZGV7TG6ASOBH4VKYVGEKGY5HNKKFX43S3GGTI3O3EYJW3WA');
    });

    it('SessionEndedRequest setter', function() {
        const sessionEndedRequest = AlexaRequestBuilder.sessionEndedRequest();

        sessionEndedRequest
            .setVersion('2.0')
            .setType('AnotherTest')
            .setRequestId('RandomRequestId')
            .setTimestamp('2017-01-01T00:00:00Z')
            .setLocale('de-DE')
            .setSessionId('RandomSessionid')
            .setApplicationId('RandomApplicationId')
            .setUserId('RandomUserId')
            .setDeviceId('RandomDeviceId')
            .setSupportedInterfaces({'VideoPlayer': {}})
            .setAudioPlayerActivity('PLAYING')
            .setAudioPlayerOffsetInMilliseconds(1000)
            .setSessionAttributes({
                'supportedHoroscopePeriodsABC': {
                    'daily': false,
                    'weekly': true,
                    'monthly': true,
                }})
            .setReason('USER_INITIATED')
            .setError({
                'type': 'INTERNAL_ERROR',
                'message': 'Error Message',
            });


        let result = {
                'version': '2.0',
                'session': {
                    'new': false,
                    'sessionId': 'RandomSessionid',
                    'application': {
                        'applicationId': 'RandomApplicationId',
                    },
                    'attributes': {
                        'supportedHoroscopePeriodsABC': {
                            'daily': false,
                            'weekly': true,
                            'monthly': true,
                        },
                    },
                    'user': {
                        'userId': 'RandomUserId',
                    },
                },
                'context': {
                    'System': {
                        'application': {
                            'applicationId': 'RandomApplicationId',
                        },
                        'user': {
                            'userId': 'RandomUserId',
                        },
                        'device': {
                            'deviceId': 'RandomDeviceId',
                            'supportedInterfaces': {
                                'VideoPlayer': {},
                            },
                        },
                    },
                    'AudioPlayer': {
                        'offsetInMilliseconds': 1000,
                        'playerActivity': 'PLAYING',
                    },
                },
                'request': {
                    'type': 'AnotherTest',
                    'requestId': 'RandomRequestId',
                    'timestamp': '2017-01-01T00:00:00Z',
                    'locale': 'de-DE',
                    'reason': 'USER_INITIATED',
                    'error': {
                        'type': 'INTERNAL_ERROR',
                        'message': 'Error Message',
                    },
                },
            }
        ;
        expect(sessionEndedRequest).to.deep.equal(result);
    });
    it('AudioPlayerRequest getter', function() {
        const audioPlayerRequest = AlexaRequestBuilder.audioPlayerRequest();

        // request
        expect(audioPlayerRequest.getVersion()).to.be.equal('1.0');
        expect(audioPlayerRequest.getType()).to.be.equal('AudioPlayer.PlaybackStarted');
        expect(audioPlayerRequest.getRequestId()).to.be.equal('amzn1.echo-api.request.0000000-0000-0000-0000-00000000000');
        expect(audioPlayerRequest.getTimestamp()).to.be.equal('2017-10-30T20:17:48Z');
        expect(audioPlayerRequest.getLocale()).to.be.equal('de-DE');
        expect(audioPlayerRequest.getOffsetInMilliseconds()).to.be.equal(0);
        expect(audioPlayerRequest.getToken()).to.be.equal('silence');

        // context
        expect(audioPlayerRequest.getSupportedInterfaces()).to.deep.equal({'AudioPlayer': {}});
        expect(audioPlayerRequest.getAudioPlayerActivity()).to.be.equal('PLAYING');
        expect(audioPlayerRequest.getAudioPlayerOffsetInMilliseconds()).to.be.equal(0);
        expect(audioPlayerRequest.getDeviceId()).to.be.equal('amzn1.ask.device.XXXXXA6LX6BOBJF6XNWQM2ZO4NVVGZRFFEL6PMXKWLOHI36IY3B4XCSZKZPR42RAWCBSQEDNGS746OCC2PKR5KDIVAUY6F2DX5GV2SQAXPD7GMKQRWLG4LFKXFPVLVTXHFGLCQKHB7ZNBKLHQU4SJG6NNGA');
        expect(audioPlayerRequest.getUserId()).to.be.equal('amzn1.account.AM3B00000000000000000000000');
    });
    it('AudioPlayerRequest setter', function() {
        const audioPlayerRequest = AlexaRequestBuilder.audioPlayerRequest();

        audioPlayerRequest
            .setVersion('2.0')
            .setType('AudioPlayer.PlaybackFinished')
            .setRequestId('RandomRequestId')
            .setTimestamp('2017-01-01T00:00:00Z')
            .setLocale('en-US')
            .setApplicationId('RandomApplicationId')
            .setUserId('RandomUserId')
            .setDeviceId('RandomDeviceId')
            .setSupportedInterfaces({'VideoPlayer': {}})
            .setToken('token123')
            .setOffsetInMilliseconds(5000);

        let result = {
            'version': '2.0',
            'context': {
                'AudioPlayer': {
                    'offsetInMilliseconds': 0,
                    'token': 'silence',
                    'playerActivity': 'PLAYING',
                },
                'System': {
                    'application': {
                        'applicationId': 'RandomApplicationId',
                    },
                    'user': {
                        'userId': 'RandomUserId',
                    },
                    'device': {
                        'deviceId': 'RandomDeviceId',
                        'supportedInterfaces': {
                            'VideoPlayer': {},
                        },
                    },
                    'apiEndpoint': 'https://api.eu.amazonalexa.com',
                },
            },
            'request': {
                'type': 'AudioPlayer.PlaybackFinished',
                'requestId': 'RandomRequestId',
                'timestamp': '2017-01-01T00:00:00Z',
                'locale': 'en-US',
                'token': 'token123',
                'offsetInMilliseconds': 5000,
            },
        };
        expect(audioPlayerRequest).to.deep.equal(result);
    });

    it('ErrorRequest getter', function() {
        const errorRequest = AlexaRequestBuilder.errorRequest();

        // request
        expect(errorRequest.getVersion()).to.be.equal('1.0');
        expect(errorRequest.getType()).to.be.equal('System.ExceptionEncountered');
        expect(errorRequest.getRequestId()).to.be.equal('amzn1.echo-api.request.0000000-0000-0000-0000-00000000000');
        expect(errorRequest.getTimestamp()).to.be.equal('2017-10-30T20:21:01Z');
        expect(errorRequest.getLocale()).to.be.equal('de-DE');
        expect(errorRequest.getError()).to.deep.equal({
            'type': 'INVALID_RESPONSE',
            'message': 'An exception occurred while dispatching the request to the skill.',
        });
        expect(errorRequest.getCause()).to.deep.equal({
            'requestId': 'amzn1.echo-api.request.0000000-0000-0000-0000-00000000000',
        });

        // context
        expect(errorRequest.getSupportedInterfaces()).to.deep.equal({'AudioPlayer': {}});
        expect(errorRequest.getAudioPlayerActivity()).to.be.equal('PLAYING');
        expect(errorRequest.getAudioPlayerOffsetInMilliseconds()).to.be.equal(0);
        expect(errorRequest.getDeviceId()).to.be.equal('amzn1.ask.device.XXXXXA6LX6BOBJF6XNWQM2ZO4NVVGZRFFEL6PMXKWLOHI36IY3B4XCSZKZPR42RAWCBSQEDNGS746OCC2PKR5KDIVAUY6F2DX5GV2SQAXPD7GMKQRWLG4LFKXFPVLVTXHFGLCQKHB7ZNBKLHQU4SJG6NNGA');
        expect(errorRequest.getUserId()).to.be.equal('amzn1.account.AM3B00000000000000000000000');
    });
    it('ErrorRequest setter', function() {
        const errorRequest = AlexaRequestBuilder.errorRequest();

        errorRequest
            .setVersion('2.0')
            .setType('System.ExceptionEncounteredABC')
            .setRequestId('RandomRequestId')
            .setTimestamp('2017-01-01T00:00:00Z')
            .setLocale('en-US')
            .setApplicationId('RandomApplicationId')
            .setUserId('RandomUserId')
            .setDeviceId('RandomDeviceId')
            .setSupportedInterfaces({'VideoPlayer': {}})
            .setError({
                type: 'INVALID_RESPONSE1',
                message: 'An exception occurred while dispatching the request to the skill. ABC',
            })
            .setCause({
                requestId: 'ABCamzn1.echo-api.request.edf998dd-49bf-4b7e-978a-28874d6c4447',
            });

        let result = {
            'version': '2.0',
            'context': {
                'AudioPlayer': {
                    'offsetInMilliseconds': 0,
                    'token': 'silence',
                    'playerActivity': 'PLAYING',
                },
                'System': {
                    'application': {
                        'applicationId': 'RandomApplicationId',
                    },
                    'user': {
                        'userId': 'RandomUserId',
                    },
                    'device': {
                        'deviceId': 'RandomDeviceId',
                        'supportedInterfaces': {
                            'VideoPlayer': {},
                        },
                    },
                    'apiEndpoint': 'https://api.eu.amazonalexa.com',
                },
            },
            'request': {
                'type': 'System.ExceptionEncounteredABC',
                'requestId': 'RandomRequestId',
                'timestamp': '2017-01-01T00:00:00Z',
                'locale': 'en-US',
                'error': {
                    'type': 'INVALID_RESPONSE1',
                    'message': 'An exception occurred while dispatching the request to the skill. ABC',
                },
                'cause': {
                    'requestId': 'ABCamzn1.echo-api.request.edf998dd-49bf-4b7e-978a-28874d6c4447',
                },
            },
        };
        expect(errorRequest).to.deep.equal(result);
    });
});

