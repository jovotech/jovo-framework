'use strict';

const Plugin = require('./../plugin').Plugin;
const fs = require('fs');

const io = require('socket.io-client');
const path = require('path');
const send = require('./../../tools/testSuite').send;
const removeSessionAttributes = require('./../../tools/testSuite').removeSessionAttributes;

const util = require('./../../util');
const _ = require('lodash');

/**
 * Jovo Debugger (work in progress)
 */
class JovoDebuggerPlugin extends Plugin {
    /**
     * Constructor
     * @param {*} options
     */
    constructor(options) {
        super(options);
    }

    /**
     * Init plugin
     */
    init() {
        let id;

        // retrieve id from jovo cli config
        try {
            const data = fs.readFileSync(path.join(getUserHome(), '.jovo/config'));
            id = JSON.parse(data.toString()).webhook.uuid;
        } catch (err) {
            console.log(`Couldn't load webhook id from jovo-cli config`);
        }

        if (!id) {
            throw new Error(`Couldn't initialize jovo debugger`);
        }

        let self = this;
        self.consoleLogOverriden = false;
        const WEBHOOK_URL = 'https://webhook.jovo.cloud';

        const socket = io.connect(WEBHOOK_URL, {
            query: {
                id: id,
                type: 'app',
            },
        });
        socket.on('connect', function() {
        });

        socket.on('connect_error', function(error) {
            console.log('Sorry, there seems to be an issue with the connection!');
        });

        // fired when debugger is opened in browser
        socket.on('readyToDebug', function() {
            // start new session
            removeSessionAttributes();

            // skip multiple console.log overrides
            if (self.consoleLogOverriden) {
                return;
            }

            let _privateLog = console.log;

            console.log = function(message) {
                let nMessage = typeof message !== 'string' ? JSON.stringify(message) : message;
                socket.emit('console.log', nMessage, (new Error()).stack.toString());
                _privateLog.apply(console, arguments); // eslint-disable-line
            };
            self.consoleLogOverriden = true;
        });

        socket.on('notReadyToDebug', function() {
        });

        // is fired when the debugger asks for the language model
        socket.on('askForLanguageModelEmit', function() {
            if (!fs.existsSync(self.options.languageModelDir)) {
                console.log(`Can't find models folder`);
                return;
            }

            readLanguageModel(self.options.languageModelDir)
                .then((languageModel) => {
                    socket.emit('languageModelEmit', languageModel);
                    return readDebuggerJson(self.options.projectDir + path.sep + 'debugger.json');
                })
                .then((debuggerConfig) => {
                    socket.emit('debuggerConfig', debuggerConfig);
                });
        });

        // fired when a request button is clicked
        socket.on('sendRequest', function(obj) {
            let req;

            // raw json request, usually on resend
            if (obj.type === 'RAW') {
                // type of request builder doesn't matter here
                req = util.getPlatformRequestBuilder('AlexaSkill')[0].request(obj.json);
                send(req).then(() => {
                    // console.log('done');
                });
            } else {
                const rb = util.getPlatformRequestBuilder(obj.platform)[0];

                if (obj.type === 'LAUNCH') {
                    req = rb.launch();
                } else if (obj.type === 'END') {
                    req = rb.end();
                } else if (obj.type === 'INTENT') {
                    req = rb.intent(obj.options.intentName, obj.options.inputs);
                } else if (obj.type === 'AUDIOPLAYER') {
                    if (obj.platform === 'AlexaSkill') {
                        const offsetInMilliSeconds = Math.round(obj.options.currentTime * 1000);

                        if (obj.options.type === 'finished') {
                            req = rb.audioPlayerRequest()
                                .setType('AudioPlayer.PlaybackFinished')
                                .setOffsetInMilliseconds(offsetInMilliSeconds);
                        } else if (obj.options.type === 'nearlyfinished') {
                            req = rb.audioPlayerRequest()
                                .setType('AudioPlayer.PlaybackNearlyFinished')
                                .setOffsetInMilliseconds(offsetInMilliSeconds);
                        } else if (obj.options.type === 'paused') {
                            req = rb.audioPlayerRequest()
                                .setType('AudioPlayer.PlaybackStopped')
                                .setOffsetInMilliseconds(offsetInMilliSeconds);
                        } else if (obj.options.type === 'started') {
                            req = rb.audioPlayerRequest()
                                .setType('AudioPlayer.PlaybackStarted')
                                .setOffsetInMilliseconds(offsetInMilliSeconds);
                        }
                    } else if (obj.platform === 'GoogleActionDialogFlowV2' ||
                        obj.platform === 'GoogleActionDialogFlow') {
                        if (obj.options.type === 'finished') {
                            req = rb.mediaResponseFinishedRequest();
                        }
                    }
                }


                // set new session (not available for every request)
                try {
                    req.setSessionNew(obj.newSession);
                } catch (e) {

                }

                // set locale (not available for every request)
                try {
                    req.setLocale(obj.locale);
                } catch (e) {

                    // set user id (not available for every request)
                }
                try {
                    req.setUserId('jovo-debugger-user');
                } catch (e) {
                }

                // google action only
                try {
                    // req.getGoogleActionRequest().setRawText(obj.rawText);
                    if (obj.type !== 'LAUNCH') {
                        req.setRawText(obj.rawText);
                    }
                } catch (e) {

                }

                try {
                    if (_.get(obj, 'device') === 'AlexaSkill.display') {
                        req.setSupportedInterfaces({
                            'AudioPlayer': {},
                            'Display': {
                                'templateVersion': '1.0',
                                'markupVersion': '1.0',
                            },
                            'VideoApp': {},
                        });
                    }

                    if (_.get(obj, 'device') === 'GoogleActionDialogFlow.phone') {
                        req.setScreenInterface();
                    } else if (_.get(obj, 'device') === 'GoogleActionDialogFlow.speaker') {
                        req.setAudioInterface();
                    }
                } catch (e) {

                }


                try {
                    // alexa only
                    req.setTimestamp((new Date()).toISOString());
                } catch (e) {

                }
                if (req) {
                    send(req).then(() => {
                        // console.log('ddone');
                    });
                }
            }
        });

        // fired after routing
        this.app.on('afterRouting', (jovo, route) => {
            let rawText = null;
            let error = null;
            let requestSessionAttributes = {};

            try {
                requestSessionAttributes = jovo.getPlatform().getRequest().getSessionAttributes();
            } catch (e) {
            }

            try {
                rawText = jovo.getPlatform().getRawText();
            } catch (e) {
            }

            // currently alexa only
            try {
                error = jovo.request().getError();
            } catch (e) {
            }

            socket.emit('requestEmit', {
                json: jovo.requestObj,
                platformType: util.getRequestType(jovo.requestObj),
                requestSessionAttributes: requestSessionAttributes,
                userId: jovo.getUserId(),
                route: route,
                inputs: jovo.getInputs(),
                rawText: rawText,
                database: jovo.user().data,
                error: error,

            });
        });
        this.app.on('response', (jovo) => {
            let responseSpeech = null;
            let requestSessionAttributes = {};
            let responseSessionAttributes = {};
            let audioplayer = null;

            try {
                responseSpeech = jovo.getPlatform().getSpeechText();
            } catch (e) {
            }

            try {
                requestSessionAttributes = jovo.getPlatform().getRequest().getSessionAttributes();
            } catch (e) {
            }

            try {
                responseSessionAttributes = jovo.getSessionAttributes();
            } catch (e) {
            }

            // Alexa Audio Player response
            try {
                audioplayer = jovo.alexaSkill()
                    .audioPlayer().response.responseObj.response.directives[0];
            } catch (e) {
            }

            // Google Action Media response
            try {
                // Dialogflow V1 or Dialogflow V2
                let responseObj = _.get(jovo.googleAction()
                        .audioPlayer().response.responseObj, 'payload') ||
                    _.get(jovo.googleAction().audioPlayer().response.responseObj, 'data');

                // get media objects from response object
                for (const item of _.get(responseObj, 'google.richResponse.items', [])) {
                    if (item.mediaResponse) {
                        audioplayer = item.mediaResponse.mediaObjects[0];
                    }
                }
            } catch (e) {
            }

            socket.emit('responseEmit', {
                json: jovo.getPlatform().getResponseObject(),
                platformType: util.getRequestType(jovo.requestObj),
                userId: jovo.getUserId(),
                route: jovo.handler.route,
                sessionEnded: jovo.getPlatform().getResponse().isTell(),
                inputs: jovo.getInputs(),
                requestSessionAttributes: requestSessionAttributes,
                responseSessionAttributes: responseSessionAttributes,
                speech: responseSpeech,
                database: jovo.user().data,
                audioplayer: audioplayer,
            });
        });

        this.app.on('handlerError', (jovo, error) => {
            console.log('error');

            socket.emit('handlerErrorEmit', {
                error: {message: error.message,
                    stack: error.stack.toString()},
            });
        });

        this.app.on('toIntent', (jovo, intent) => {
            socket.emit('publicMethods', {
                msg: '<div class="public-methods">toIntent --> ' + intent + '</div>',
            });
        });

        this.app.on('toStateIntent', (jovo, state, intent) => {
            socket.emit('publicMethods', {
                msg: '<div class="public-methods">toStateIntent --> '+ state + '.' + intent + '</div>',
            });
        });
    }
}


/**
 * Returns language model object
 * @param {string} languageModelDir
 * @return {Promise<any>}
 */
function readLanguageModel(languageModelDir) {
    return new Promise((resolve, reject) => {
        let languageModel = {};
        // retrieve language model files and emit object to debugger
        fs.readdir(languageModelDir, (err, files) => {
            if (err) {
                return reject(err);
            }

            for (const file of files) {
                if (!_.endsWith(file, '.json')) {
                    continue;
                }
                const locale = file.substring(0, file.indexOf('.json'));
                languageModel[locale] = require(
                    languageModelDir + path.sep + file);
            }

            resolve(languageModel);
        });
    });
}

/**
 * Returns parsed debugger config
 * @param {string} debuggerJsonPath
 * @return {Promise<any>}
 */
function readDebuggerJson(debuggerJsonPath) {
    return new Promise((resolve, reject) => {
        fs.readFile(debuggerJsonPath, (err, data) => {
            if (err) {
                return resolve({});
            }
            resolve(JSON.parse(data));
        });
    });
}


/**
 * Helper method to find userHome directory
 * @return {*}
 */
function getUserHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports.JovoDebuggerPlugin = JovoDebuggerPlugin;
