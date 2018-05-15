'use strict';
const chai = require('chai');
const assert = chai.assert;
const expect = require('chai').expect;
chai.should();


// let should = chai.should;
const App = require('../../lib/app').App;
const BaseApp = require('../../lib/app');

const RequestBuilderAlexaSkill = require('../../lib/platforms/alexaSkill/request/util/requestBuilder').RequestBuilder;

const webhookAlexaIntentRequestResponseJSON = '{"domain":null,"_events":{},"_eventsCount":1,"output":[],"outputEncodings":[],"outputCallbacks":[],"outputSize":0,"writable":true,"_last":false,"upgrading":false,"chunkedEncoding":false,"shouldKeepAlive":true,"useChunkedEncodingByDefault":true,"sendDate":true,"_removedHeader":{},"_contentLength":null,"_hasBody":true,"_trailer":"","finished":false,"_headerSent":false,"socket":{"connecting":false,"_hadError":false,"_handle":{"bytesRead":2006,"_externalStream":{},"fd":-1,"reading":true,"owner":"~socket","onconnection":null,"writeQueueSize":0},"_parent":null,"_host":null,"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":false,"endEmitted":false,"reading":true,"sync":false,"needReadable":true,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":true,"domain":null,"_events":{"end":[null,null],"drain":[null,null],"close":[null,null]},"_eventsCount":10,"_writableState":{"objectMode":false,"highWaterMark":16384,"needDrain":false,"ending":false,"ended":false,"finished":false,"decodeStrings":false,"defaultEncoding":"utf8","length":0,"writing":false,"corked":0,"sync":true,"bufferProcessing":false,"writecb":null,"writelen":0,"bufferedRequest":null,"lastBufferedRequest":null,"pendingcb":0,"prefinished":false,"errorEmitted":false,"bufferedRequestCount":0,"corkedRequestsFree":{"next":null,"entry":null}},"writable":true,"allowHalfOpen":true,"destroyed":false,"_bytesDispatched":0,"_sockname":null,"_pendingData":null,"_pendingEncoding":"","server":{"domain":null,"_events":{},"_eventsCount":2,"_connections":1,"_handle":{"bytesRead":0,"_externalStream":{},"fd":-1,"reading":false,"owner":"~socket~server","onread":null,"writeQueueSize":0},"_usingSlaves":false,"_slaves":[],"_unref":false,"allowHalfOpen":true,"pauseOnConnect":false,"httpAllowHalfOpen":false,"timeout":120000,"_pendingResponseData":0,"_connectionKey":"6::::3000"},"_server":"~socket~server","_idleTimeout":120000,"_idleNext":{"_idleNext":"~socket","_idlePrev":"~socket","_timer":{"_list":"~socket~_idleNext"},"_unrefed":true,"msecs":120000},"_idlePrev":"~socket~_idleNext","_idleStart":8664,"parser":{"_headers":[],"_url":"","_consumed":true,"socket":"~socket","incoming":{"_readableState":{"objectMode":false,"highWaterMark":16384,"buffer":{"head":null,"tail":null,"length":0},"length":0,"pipes":null,"pipesCount":0,"flowing":true,"ended":true,"endEmitted":true,"reading":false,"sync":false,"needReadable":false,"emittedReadable":false,"readableListening":false,"resumeScheduled":false,"defaultEncoding":"utf8","ranOut":false,"awaitDrain":0,"readingMore":false,"decoder":null,"encoding":null},"readable":false,"domain":null,"_events":{},"_eventsCount":0,"socket":"~socket","connection":"~socket","httpVersionMajor":1,"httpVersionMinor":1,"httpVersion":"1.1","complete":true,"headers":{"content-type":"application/json; charset=utf-8","accept":"application/json","accept-charset":"utf-8","signature":"aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","signaturecertchainurl":"https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","content-length":"1290","host":"31bdcaa9.ngrok.io","user-agent":"Apache-HttpClient/4.5.x (Java/1.8.0_112)","x-forwarded-proto":"https","x-forwarded-for":"72.21.217.175"},"rawHeaders":["Content-Type","application/json; charset=utf-8","Accept","application/json","Accept-Charset","utf-8","Signature","aZyyXmQqNdcUTJ1Z7T7TTsJsTO58oRGVg1uBgpU5luS2+HIVmk+NMAs/ocp0T/IL7lGOJ3TtjIiDTHQs5FlndJhdTN7bjyYtpqfc6XgqZNXVuzBeu2rKJyc4iEI6dkiKusF5BXrArGVsKOv0El52Obi9lB5XEOJatpDRHL9pl+42hYHN6h1GTSIZdtkqPN0DeMbrmaK+SYGSvb0AjaEz07hie9Sf89R2Yw1PGvMp6Uk/2Y4YuD3xcYn+KfIix0UMfI2tLFm828mHNhabMAGbGAZ5iQLDW35kXvpRZ/PEWvmbIxGgsqXpeaXa1SXyp+U9qKUofubRk+t9ndzWf5XdGw==","SignatureCertChainUrl","https://s3.amazonaws.com/echo.api/echo-api-cert-4.pem","Content-Length","1290","Host","31bdcaa9.ngrok.io","User-Agent","Apache-HttpClient/4.5.x (Java/1.8.0_112)","X-Forwarded-Proto","https","X-Forwarded-For","72.21.217.175"],"trailers":{},"rawTrailers":[],"upgrade":false,"url":"/webhook","method":"POST","statusCode":null,"statusMessage":null,"client":"~socket","_consuming":true,"_dumped":false,"baseUrl":"","originalUrl":"/webhook","_parsedUrl":{"protocol":null,"slashes":null,"auth":null,"host":null,"port":null,"hostname":null,"hash":null,"search":null,"query":null,"pathname":"/webhook","path":"/webhook","href":"/webhook","_raw":"/webhook"},"params":{},"query":{},"res":"~","body":{"version":"1.0","session":{"new":true,"sessionId":"amzn1.echo-api.session.ce892f42-d6be-4097-a684-6f01f1bf31be","application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"}},"context":{"AudioPlayer":{"playerActivity":"STOPPED"},"System":{"application":{"applicationId":"amzn1.ask.skill.da189077-4646-4d7f-9b90-722a59a8e6c4"},"user":{"userId":"amzn1.ask.account.AFO32TGCNESUA3D5SUYB3YAMT5WVPYYZENYDI7IXZUJQCNOZLFMQFS7EXOSJ5HIRGDN5NO7MFXG4TC37GNG6HTHRRYKQLUF2BVV3LSKZNDU57T3F7ADY2LICCXV7LVL5LIZS5IWWENFM3NKG4AP4P4QRH3GSJJ4DIO65R6JVXOGX2V4CLDUCT4K735WZILHGUDKQATPHZQIMW4Y"},"device":{"deviceId":"amzn1.ask.device.AHTBHAUKNGBO44QH6IDG4UHF2VHTKD4B7ZLLZVUQHTNNNSGBHABNZWMRXNDJJKKGB5A4QKZ4D72XEHVG4HKCRTR73XH7TPIVB3RTCQJZC4FQZPFG3DXKB4KXB3ZDTUACJ3VOZTUQCZDHY5Y62RUMMW5YN7EA","supportedInterfaces":{"AudioPlayer":{}}},"apiEndpoint":"https://api.amazonalexa.com"}},"request":{"type":"LaunchRequest","requestId":"amzn1.echo-api.request.4812a2af-8a96-47fb-9c1d-00b46c85cb12","timestamp":"2017-06-12T15:41:07Z","locale":"en-US"}},"_body":true,"route":{"path":"/webhook","stack":[{"name":"<anonymous>","keys":[],"regexp":{"fast_star":false,"fast_slash":false},"method":"post"}],"methods":{"post":true}}},"outgoing":null,"maxHeaderPairs":2000},"_paused":false,"_consuming":true,"_httpMessage":"~"},"connection":"~socket","_header":null,"_headers":{"x-powered-by":"Express"},"_headerNames":{"x-powered-by":"X-Powered-By"},"req":"~socket~parser~incoming","locals":{}}';
let response = JSON.parse(webhookAlexaIntentRequestResponseJSON);

// workaround
response.json = function(json) {};

describe('constructor', function() {
    it('should set the default config', function() {
        const app = new App();
        delete app.config.plugins;
        expect(app.config).to.deep.equal(BaseApp.DEFAULT_CONFIG);
    });
    it('should override the default config', function() {
        let app = new App();
        app.setConfig({
            logging: true,
            requestLogging: true,
            responseLogging: true,
            saveUserOnResponseEnabled: false,
            userDataCol: 'otherColumnName',
            inputMap: {
                'given-name': 'name',
            },
            intentMap: {
                'AMAZON.StopIntent': 'StopIntent',
            },
            intentsToSkipUnhandled: ['IntentA', 'IntentB'],
            requestLoggingObjects: ['session'],
            responseLoggingObjects: ['response'],
            saveBeforeResponseEnabled: true,
            allowedApplicationIds: ['id1', 'id2'],
            db: {
                type: 'file',
                localDbFilename: 'otherFilename',
            },
            userMetaData: {
                lastUsedAt: false,
                sessionsCount: false,
                createdAt: false,
                requestHistorySize: 5,
                devices: true,
            },
            i18n: {
                returnObjects: true,
                resources: {
                    'en-US': {
                        translation: {
                            WELCOME: 'Welcome',
                        },
                    },
                    'de-DE': {
                        translation: {
                            WELCOME: 'Willkommen',
                        },
                    },
                },
            },
            analytics: {
                intentsToSkip: [],
                usersToSkip: [],
                intentsToTrack: [],
                services: {
                    VoiceLabsAlexa: {
                        key: 'ACCESS_KEY',
                    },
                    VoiceLabsGoogleAction: {
                        key: 'ACCESS_KEY',
                    },
                },
            },
        });
        expect(app.config.logging).to.equal(true);
        expect(app.config.requestLogging).to.equal(true);
        expect(app.config.responseLogging).to.equal(true);
        expect(app.config.saveUserOnResponseEnabled).to.equal(false);
        expect(app.config.userDataCol).to.equal('otherColumnName');
        expect(app.config.inputMap).to.deep.equal({
            'given-name': 'name',
        });
        expect(app.config.intentMap).to.deep.equal({
            'AMAZON.StopIntent': 'StopIntent',
        });
        expect(app.config.intentsToSkipUnhandled).to.deep.equal(['IntentA', 'IntentB']);

        expect(app.config.requestLoggingObjects).to.deep.equal(['session']);
        expect(app.config.responseLoggingObjects).to.deep.equal(['response']);
        expect(app.config.saveBeforeResponseEnabled).to.equal(true);
        expect(app.config.allowedApplicationIds).to.deep.equal(['id1', 'id2']);
        expect(app.config.db.localDbFilename).to.equal('otherFilename');

        expect(app.config.userMetaData).to.deep.include({
            lastUsedAt: false,
            sessionsCount: false,
            createdAt: false,
            requestHistorySize: 5,
            devices: true,
        });
        expect(app.config.i18n).to.deep.include(
            {
                returnObjects: true,
                resources: {
                    'en-US': {
                        translation: {
                            WELCOME: 'Welcome',
                        },
                    },
                    'de-DE': {
                        translation: {
                            WELCOME: 'Willkommen',
                        },
                    },
                },
            }
        );
        expect(app.config.analytics).to.deep.include(
            {
                intentsToSkip: [],
                usersToSkip: [],
                intentsToTrack: [],
                services: {
                    VoiceLabsAlexa: {
                        key: 'ACCESS_KEY',
                    },
                    VoiceLabsGoogleAction: {
                        key: 'ACCESS_KEY',
                    },
                },
            }
        );
    });
});


describe('getConfig', function() {
    it('should return config', function() {
        const app = new App();
        delete app.config.plugins;
        expect(app.getConfig()).to.deep.equal(BaseApp.DEFAULT_CONFIG);
    });
});


describe('enableRequestLogging()', function() {
    it('should return true when enabled', function() {
        let app = new App();
        assert(app.config.requestLogging === false, 'false on default');
        app.enableRequestLogging();
        assert(app.config.requestLogging === true, 'true after enabling');
        app.enableRequestLogging(false);
        assert(app.config.requestLogging === false, 'false after disabling');
        app.enableRequestLogging(true);
        assert(app.config.requestLogging === true, 'true after enabling');
    });
});

describe('enableResponseLogging()', function() {
    it('should return true when enabled', function() {
        let app = new App();
        assert(app.config.responseLogging === false, 'false on default');
        app.enableResponseLogging();
        assert(app.config.responseLogging === true, 'true after enabling');
        app.enableResponseLogging(false);
        assert(app.config.responseLogging === false, 'false after disabling');
        app.enableResponseLogging(true);
        assert(app.config.responseLogging === true, 'true after enabling');
    });
});


describe('enableLogging()', function() {
    it('should return true when enabled', function() {
        let app = new App();
        assert(app.config.requestLogging === false, 'false on default');
        assert(app.config.responseLogging === false, 'false on default');
        app.enableLogging();
        assert(app.config.requestLogging === true, 'true after enabling');
        assert(app.config.responseLogging === true, 'true after enabling');
        app.enableLogging(false);
        assert(app.config.requestLogging === false, 'false after disabling');
        assert(app.config.responseLogging === false, 'false after disabling');
        app.enableLogging(true);
        assert(app.config.responseLogging === true, 'true after enabling');
        assert(app.config.requestLogging === true, 'true after enabling');
    });
});

describe('setRequestLoggingObjects()', function() {
    it('should return correct request logging objects', function() {
        let app = new App();
        app.setRequestLoggingObjects('request');
        expect(app.config.requestLoggingObjects).to.be.an('array');
        expect(app.config.requestLoggingObjects).to.deep.equal(['request']);
        app.setRequestLoggingObjects(['request', 'session']);
        expect(app.config.requestLoggingObjects).to.be.an('array');
        expect(app.config.requestLoggingObjects).to.deep.equal(['request', 'session']);
    });
});

describe('setResponseLoggingObjects()', function() {
    it('should return correct response logging objects', function() {
        let app = new App();
        app.setResponseLoggingObjects('request');
        expect(app.config.responseLoggingObjects).to.be.an('array');
        expect(app.config.responseLoggingObjects).to.deep.equal(['request']);
        app.setResponseLoggingObjects(['request', 'session']);
        expect(app.config.responseLoggingObjects).to.be.an('array');
        expect(app.config.responseLoggingObjects).to.deep.equal(['request', 'session']);
    });
});

describe('setSaveUserOnResponseEnabled()', function() {
    it('should set saveUserOnResponseEnabled config variable', function() {
        let app = new App();
        assert(app.config.saveUserOnResponseEnabled === true, 'true on default');
        app.setSaveUserOnResponseEnabled(false);
        assert(app.config.saveUserOnResponseEnabled === false, 'false');
        app.setSaveUserOnResponseEnabled();
        assert(app.config.saveUserOnResponseEnabled === true, 'true');
        app.setSaveUserOnResponseEnabled(true);
        assert(app.config.saveUserOnResponseEnabled === true, 'true');
    });
});

describe('setUserDataCol()', function() {
    it('should set userDataCol config variable', function() {
        let app = new App();
        assert(app.config.userDataCol === 'userData', 'userData on default');
        app.setUserDataCol('anyothername');
        assert(app.config.userDataCol === 'anyothername', 'anyothername');
    });
});


describe('setSaveBeforeResponseEnabled()', function() {
    it('should set saveBeforeResponseEnabled config variable', function() {
        let app = new App();
        assert(app.config.saveBeforeResponseEnabled === false, 'false on default');
        app.setSaveBeforeResponseEnabled();
        assert(app.config.saveBeforeResponseEnabled === true, 'true');
        app.setSaveBeforeResponseEnabled(false);
        assert(app.config.saveBeforeResponseEnabled === false, 'false');
        app.setSaveBeforeResponseEnabled(true);
        assert(app.config.saveBeforeResponseEnabled === true, 'true');
    });
});

describe('setDB()', function() {
    it('should set the correct database configuration', function() {
        let app = new App();
        assert(app.config.db.type === 'file', 'file on default');
        assert(app.config.db.localDbFilename === 'db', 'db on default');

        assert.throws(
            function() {
                app.setDb();
            },
            Error,
            'db config must be an object'
        );
        assert.throws(
            function() {
                app.setDb({});
            },
            Error,
            'db type is not defined'
        );
        assert.throws(
            function() {
                app.setDb({
                    type: 'otherdb',
                });
            },
            Error,
            'Database type otherdb is not supported.'
        );

        assert.throws(
            function() {
                app.setDb({
                    type: 'file',
                });
            },
            Error,
            'localDbFilename variable is not defined'
        );
        assert.throws(
            function() {
                app.setDb({
                    type: 'dynamodb',
                });
            },
            Error,
            'tableName variable is not defined'
        );


        app.setDb({
            type: 'file',
            localDbFilename: 'db',
        });
        assert(app.moduleDatabase.constructor.name === 'Db', 'Db class');
        assert(app.moduleDatabase.databaseInstances.file.constructor.name === 'FilePersistence', 'FilePersistence class');
        assert(app.moduleDatabase.databaseInstances.file.filename === './db/db.json', 'db.json');

        // temporarily removed
        // app.setDb({
        //     type: 'dynamodb',
        //     tableName: 'myvoiceapp',
        // });
        // assert(app.moduleDatabase.constructor.name === 'Db', 'Db class');
        //  assert(app.moduleDatabase.databaseInstances.dynamodb.constructor.name === 'DynamoDb',
        //      'DynamoDb class');
    });
});

describe.skip('setDynamoDB()', function() {
    it('should set the dynamo db configuration', function() {
        let app = new App();
        app.setDynamoDb('myvoiceapp');
        assert(app.moduleDatabase.constructor.name === 'Db', 'Db class');
        assert(app.moduleDatabase.databaseInstances.dynamodb.constructor.name === 'DynamoDb', 'DynamoDb class');
    });
});

describe('setDynamoDbKey()', function() {
    it('should set the correct dynamodb key', function() {
        let app = new App();
        app.setDynamoDbKey('key');
        assert(app.config.dynamoDbKey === 'key', 'key');
    });
});

describe('setUserMetaData()', function() {
    it('should set the correct user meta data values', function() {
        let app = new App();

        assert.throws(
            function() {
                app.setUserMetaData({
                    anyvar: 'anyval',
                });
            },
            Error,
            'anyvar is not a valid userMetaData property.'
        );

        assert.throws(
            function() {
                app.setUserMetaData({
                    lastUsedAt: 'anyval',
                });
            },
            Error,
            'lastUsedAt has to be of type boolean'
        );

        assert.throws(
            function() {
                app.setUserMetaData({
                    sessionsCount: 'anyval',
                });
            },
            Error,
            'sessionsCount has to be of type boolean'
        );

        assert.throws(
            function() {
                app.setUserMetaData({
                    createdAt: 'anyval',
                });
            },
            Error,
            'createdAt has to be of type boolean'
        );

        assert.throws(
            function() {
                app.setUserMetaData({
                    requestHistorySize: 'anyval',
                });
            },
            Error,
            'requestHistorySize has to be of type number'
        );

        assert.throws(
            function() {
                app.setUserMetaData({
                    devices: 'anyval',
                });
            },
            Error,
            'devices has to be of type boolean'
        );

        app.setUserMetaData({
            lastUsedAt: false,
            sessionsCount: false,
            createdAt: false,
            requestHistorySize: 5,
            devices: true,
        });

        assert(app.config.userMetaData.lastUsedAt === false);
        assert(app.config.userMetaData.sessionsCount === false);
        assert(app.config.userMetaData.createdAt === false);
        assert(app.config.userMetaData.requestHistorySize === 5);
        assert(app.config.userMetaData.devices === true);
    });
});

describe('setI18n', function() {
    it('should set the correct i18n config', function() {
        let app = new App();
        assert(app.config.i18n.returnObjects === true); // default config
        app.setI18n({
            returnObjects: false,
        });
        assert(app.config.i18n.returnObjects === false);
    });
});

describe('setLanguageResources', function() {
    it('should set the correct language resources', function() {
        let app = new App();
        assert(app.config.i18n.resources === undefined); // default config

        assert.throws(
            function() {
                app.setLanguageResources('');
            },
            Error,
            'Invalid language resource.'
        );

        app.setLanguageResources({
            'en-US': {
                translation: {
                    WELCOME: 'Welcome',
                },
            },
            'de-DE': {
                translation: {
                    WELCOME: 'Willkommen',
                },
            }});
        assert(app.i18n.constructor.name === 'I18n'); // default config
    });
});


describe('setAnalytics', function() {
    it('should set the correct analytics', function() {
        let app = new App();

        app.setAnalytics(
            {
                intentsToSkip: ['HelloWorldIntent'],
                usersToSkip: ['userId123'],
                services: {
                    ChatbaseAlexa: {
                        key: 'chatbasekey',
                    },
                },
            }
        );
        expect(app.config.analytics).to.deep.equal({
                intentsToSkip: ['HelloWorldIntent'],
                usersToSkip: ['userId123'],
                services: {
                    ChatbaseAlexa: {
                        key: 'chatbasekey',
                    },
                },
            });
        assert(app.moduleAnalytics.constructor.name === 'Analytics'); // default config
    });
});

describe('addAnalytics', function() {
    it('should add the correct analytics', function() {
        let app = new App();
        app.addAnalytics('ChatbaseAlexa', {
            key: 'key1',
        });
        assert(app.moduleAnalytics.constructor.name === 'Analytics');
        assert(app.moduleAnalytics.services['ChatbaseAlexa'].constructor.name === 'ChatbaseAlexa');
        assert(app.moduleAnalytics.services['ChatbaseAlexa'].platformType === 'AlexaSkill');
    });

    it('addBespokenAnalytics()', function() {
        let app = new App();
        app.addBespokenAnalytics('key1');
        assert(app.moduleAnalytics.services['BespokenAlexa'].constructor.name === 'BespokenAlexa');
        assert(app.moduleAnalytics.services['BespokenAlexa'].platformType === 'AlexaSkill');

        assert(app.moduleAnalytics.services['BespokenGoogleAction'].constructor.name === 'BespokenGoogleAction');
        assert(app.moduleAnalytics.services['BespokenGoogleAction'].platformType === 'GoogleAction');
    });
    it('addChatbaseAnalytics()', function() {
        let app = new App();
        app.addChatbaseAnalytics('key1');
        assert(app.moduleAnalytics.services['ChatbaseAlexa'].constructor.name === 'ChatbaseAlexa');
        assert(app.moduleAnalytics.services['ChatbaseAlexa'].platformType === 'AlexaSkill');

        assert(app.moduleAnalytics.services['ChatbaseGoogleAction'].constructor.name === 'ChatbaseGoogleAction');
        assert(app.moduleAnalytics.services['ChatbaseGoogleAction'].platformType === 'GoogleAction');
    });
});

describe('setPolly', function() {
    it('should set the correct polly config', function() {
        let app = new App();


        assert.throws(
            function() {
                app.setPolly({});
            },
            Error,
            's3bucket has to be defined'
        );

        assert.throws(
            function() {
                app.setPolly({
                    s3bucket: 'bucketName',
                });
            },
            Error,
            'voiceId has to be defined'
        );
        app.setPolly({
            s3bucket: 'bucketName',
            voiceId: 'Hans',
            awsConfig: {
                accessKeyId: 'id',
                secretAccessKey: 'key',
                region: 'us-east-1',
            },
        });
        expect(app.config.polly).to.deep.equal({
            s3bucket: 'bucketName',
            voiceId: 'Hans',
            awsConfig: {
                accessKeyId: 'id',
                secretAccessKey: 'key',
                region: 'us-east-1',
            },
        });
    });
});

describe('setHandler', function() {
    it('should set the correct handler', function() {
        let app = new App();

        app.setHandler({
            'LAUNCH': function() {
            },
            'HelloWorldIntent': function() {
            },
        });
        expect(app.config.handlers).to.have.all.keys('LAUNCH', 'HelloWorldIntent');
    });
    it('should allow seperate objects as handler', function() {
        let app = new App();

        const handler1 = {
            'LAUNCH': function() {
            },
        };

        const handler2 = {
            'State1': {
                'Intent1': function() {
                    this.tell();
                },
            },
        };

        const handler3 = {
            'State2': {
                'Intent2': function() {
                    this.tell();
                },
            },
        };

        app.setHandler(
            handler1,
            handler2,
            handler3
        );

        expect(app.config.handlers).to.have.all.keys('LAUNCH', 'State1', 'State2');
    });
});

describe('setAlexaHandler', function() {
    it('should set the correct handler (AlexaSkill)', function() {
        let app = new App();

        app.setAlexaHandler({
            'LAUNCH': function() {
            },
            'AlexaHelloWorldIntent': function() {
            },
        });
        expect(app.config.alexaSkill.handlers).to.have.all.keys('LAUNCH', 'AlexaHelloWorldIntent');
    });

    it('should allow seperate objects as handler', function() {
        let app = new App();

        const handler1 = {
            'LAUNCH': function() {
            },
        };

        const handler2 = {
            'AlexaHelloWorldIntent': function() {
                    this.tell();
            },
        };

        const handler3 = {
            'State2': {
                'Intent2': function() {
                    this.tell();
                },
            },
        };

        app.setAlexaHandler(
            handler1,
            handler2,
            handler3
        );

        expect(app.config.alexaSkill.handlers).to.have.all.keys('LAUNCH', 'AlexaHelloWorldIntent', 'State2');
    });
});

describe('setGoogleActionHandler', function() {
    it('should set the correct handler', function() {
        let app = new App();

        app.setGoogleActionHandler({
            'LAUNCH': function() {
            },
            'GoogleActionHelloWorldIntent': function() {
            },
        });
        expect(app.config.googleAction.handlers).to.have.all.keys('LAUNCH', 'GoogleActionHelloWorldIntent');
    });

    it('should allow seperate objects as handler', function() {
        let app = new App();

        const handler1 = {
            'LAUNCH': function() {
            },
        };

        const handler2 = {
            'GoogleActionHelloWorldIntent': function() {
                this.tell();
            },
        };

        const handler3 = {
            'State2': {
                'Intent2': function() {
                    this.tell();
                },
            },
        };

        app.setGoogleActionHandler(
            handler1,
            handler2,
            handler3
        );

        expect(app.config.googleAction.handlers).to.have.all.keys('LAUNCH', 'GoogleActionHelloWorldIntent', 'State2');
    });
});


describe('setIntentMap', function() {
    it('should return empty intentMap', function() {
        let app = new App();
        assert(Object.keys(app.config.intentMap).length === 0, 'intentMap is empty');
    });

    it('should return defined intentMap', function() {
        let app = new App({
            intentMap: {
                'NameIntent': 'HelloWorldIntent',
            },
        });
        assert(typeof app.config.intentMap !== 'undefined', 'intentMap is not undefined');
        assert(app.config.intentMap['NameIntent'] === 'HelloWorldIntent', 'mapping is correct');
    });
});
describe('setInputMap', function() {
    it('should return defined inputMap', function() {
        let app = new App({
            inputMap: {
                'given-name': 'name',
            },
        });

        assert(typeof app.config.inputMap !== 'undefined', 'inputMap is not undefined');
        assert(app.config.inputMap['given-name'] === 'name', 'mapping is correct');
    });

    it('should return mapped input', function(done) {
        let app = new App({
            inputMap: {
                'firstname': 'name',
            },
        });

        let request = RequestBuilderAlexaSkill
            .intentRequest()
            .setIntentName('HelloWorldIntent')
            .addSlot('firstname', 'foobar');

        app.handleRequest(request.buildHttpRequest(), response, {
            'HelloWorldIntent': function() {
                assert(this.getInput('name').value === 'foobar', 'mapping is correct');
                done();
            },
        });
    });
});

describe('setConfig(config)', function() {
    it('should return correct default config', function() {
        let app = new App();
        expect(app.config.logging).to.equal(false);
        expect(app.config.requestLogging).to.equal(false);
        expect(app.config.responseLogging).to.equal(false);
        expect(app.config.saveUserOnResponseEnabled).to.equal(true);
        expect(app.config.userDataCol).to.equal('userData');
        expect(app.config.inputMap).to.deep.equal({});
        expect(app.config.intentMap).to.deep.equal({});
        expect(app.config.intentsToSkipUnhandled).to.deep.equal([]);

        expect(app.config.requestLoggingObjects).to.deep.equal([]);
        expect(app.config.responseLoggingObjects).to.deep.equal([]);
        expect(app.config.saveBeforeResponseEnabled).to.equal(false);
        expect(app.config.allowedApplicationIds).to.deep.equal([]);
        expect(app.config.db.localDbFilename).to.equal('db');

        expect(app.config.userMetaData).to.deep.include({
                lastUsedAt: true,
                sessionsCount: true,
                createdAt: true,
                requestHistorySize: 0,
                devices: false,
        });
        expect(app.i18n).to.equal(undefined);
        expect(Object.keys(BaseApp.DEFAULT_CONFIG)).to.have.a.lengthOf(19);
        expect(Object.keys(BaseApp.DEFAULT_CONFIG.userMetaData)).to.have.a.lengthOf(5);
    });

    it('should override default config', function() {
        let app = new App();
        app.setConfig({
            logging: true,
            requestLogging: true,
            responseLogging: true,
            saveUserOnResponseEnabled: false,
            userDataCol: 'otherColumnName',
            inputMap: {
                'given-name': 'name',
            },
            intentMap: {
                'AMAZON.StopIntent': 'StopIntent',
            },
            intentsToSkipUnhandled: ['IntentA', 'IntentB'],
            requestLoggingObjects: ['session'],
            responseLoggingObjects: ['response'],
            saveBeforeResponseEnabled: true,
            allowedApplicationIds: ['id1', 'id2'],
            db: {
                type: 'file',
                localDbFilename: 'otherFilename',
            },
            userMetaData: {
                lastUsedAt: false,
                sessionsCount: false,
                createdAt: false,
                requestHistorySize: 5,
                devices: true,
            },
            i18n: {
                returnObjects: true,
                resources: {
                    'en-US': {
                        translation: {
                            WELCOME: 'Welcome',
                        },
                    },
                    'de-DE': {
                        translation: {
                            WELCOME: 'Willkommen',
                        },
                    },
                },
            },
            analytics: {
                intentsToSkip: [],
                usersToSkip: [],
                intentsToTrack: [],
                services: {
                    VoiceLabsAlexa: {
                        key: 'ACCESS_KEY',
                    },
                    VoiceLabsGoogleAction: {
                        key: 'ACCESS_KEY',
                    },
                },
            },
        });
        expect(app.config.logging).to.equal(true);
        expect(app.config.requestLogging).to.equal(true);
        expect(app.config.responseLogging).to.equal(true);
        expect(app.config.saveUserOnResponseEnabled).to.equal(false);
        expect(app.config.userDataCol).to.equal('otherColumnName');
        expect(app.config.inputMap).to.deep.equal({
            'given-name': 'name',
        });
        expect(app.config.intentMap).to.deep.equal({
            'AMAZON.StopIntent': 'StopIntent',
        });
        expect(app.config.intentsToSkipUnhandled).to.deep.equal(['IntentA', 'IntentB']);

        expect(app.config.requestLoggingObjects).to.deep.equal(['session']);
        expect(app.config.responseLoggingObjects).to.deep.equal(['response']);
        expect(app.config.saveBeforeResponseEnabled).to.equal(true);
        expect(app.config.allowedApplicationIds).to.deep.equal(['id1', 'id2']);
        expect(app.config.db.localDbFilename).to.equal('otherFilename');

        expect(app.config.userMetaData).to.deep.include({
            lastUsedAt: false,
            sessionsCount: false,
            createdAt: false,
            requestHistorySize: 5,
            devices: true,
        });
        expect(app.config.i18n).to.deep.include(
            {
                returnObjects: true,
                resources: {
                    'en-US': {
                        translation: {
                            WELCOME: 'Welcome',
                        },
                    },
                    'de-DE': {
                        translation: {
                            WELCOME: 'Willkommen',
                        },
                    },
                },
            }
        );
        expect(app.config.analytics).to.deep.include(
            {
                intentsToSkip: [],
                usersToSkip: [],
                intentsToTrack: [],
                services: {
                    VoiceLabsAlexa: {
                        key: 'ACCESS_KEY',
                    },
                    VoiceLabsGoogleAction: {
                        key: 'ACCESS_KEY',
                    },
                },
            }
        );
    });
});
