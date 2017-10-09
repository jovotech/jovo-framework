'use strict';

const LaunchRequest = require('./launchRequest').LaunchRequest;

class RequestBuilder {

    constructor() {
    }

    static launchRequest(request) {
        if (request) {
           return new LaunchRequest(request);
        } else {
            return new LaunchRequest(launchRequestSample);
        }
    }

}


const launchRequestSample = {
    'session': {
        'new': true,
        'sessionId': 'amzn1.echo-api.session.[unique-value-here]',
        'attributes': {},
        'user': {
            'userId': 'amzn1.ask.account.[unique-value-here]',
        },
        'application': {
            'applicationId': 'amzn1.ask.skill.[unique-value-here]',
        },
    },
    'version': '1.0',
    'request': {
        'locale': 'en-US',
        'timestamp': '2016-10-27T18:21:44Z',
        'type': 'LaunchRequest',
        'requestId': 'amzn1.echo-api.request.[unique-value-here]',
    },
    'context': {
        'AudioPlayer': {
            'playerActivity': 'IDLE',
        },
        'System': {
            'device': {
                'supportedInterfaces': {
                    'AudioPlayer': {},
                },
            },
            'application': {
                'applicationId': 'amzn1.ask.skill.[unique-value-here]',
            },
            'user': {
                'userId': 'amzn1.ask.account.[unique-value-here]',
            },
        },
    },
};

const intentRequestSample = {
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.[unique-value-here]',
        'attributes': {},
        'user': {
            'userId': 'amzn1.ask.account.[unique-value-here]',
        },
        'application': {
            'applicationId': 'amzn1.ask.skill.[unique-value-here]',
        },
    },
    'version': '1.0',
    'request': {
        'locale': 'en-US',
        'timestamp': '2016-10-27T21:06:28Z',
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.[unique-value-here]',
        'intent': {
            'slots': {},
            'name': 'IntentName',
        },
    },
    'context': {
        'AudioPlayer': {
            'playerActivity': 'IDLE',
        },
        'System': {
            'device': {
                'supportedInterfaces': {
                    'AudioPlayer': {},
                },
            },
            'application': {
                'applicationId': 'amzn1.ask.skill.[unique-value-here]',
            },
            'user': {
                'userId': 'amzn1.ask.account.[unique-value-here]',
            },
        },
    },
};

const sessionEndedRequestSample = {
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.[unique-value-here]',
        'attributes': {},
        'user': {
            'userId': 'amzn1.ask.account.[unique-value-here]',
        },
        'application': {
            'applicationId': 'amzn1.ask.skill.[unique-value-here]',
        },
    },
    'version': '1.0',
    'request': {
        'locale': 'en-US',
        'timestamp': '2016-10-27T21:11:41Z',
        'reason': 'USER_INITIATED',
        'type': 'SessionEndedRequest',
        'requestId': 'amzn1.echo-api.request.[unique-value-here]',
    },
    'context': {
        'System': {
            'device': {
                'supportedInterfaces': {
                    'AudioPlayer': {},
                },
            },
            'application': {
                'applicationId': 'amzn1.ask.skill.[unique-value-here]',
            },
            'user': {
                'userId': 'amzn1.ask.account.[unique-value-here]',
            },
        },
    },
};
