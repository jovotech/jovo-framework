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
            console.log(error);
        });
        socket.on('readyToDebug', function() {
            removeSessionAttributes();
            if (self.consoleLogOverriden) {
                return;
            }

            let _privateLog = console.log;

            console.log = function(message) {
                socket.emit('console.log', message, (new Error()).stack.toString());
                _privateLog.apply(console, arguments); // eslint-disable-line
            };
            self.consoleLogOverriden = true;
            // console.log('Debugger UI attached');
        });

        socket.on('notReadyToDebug', function() {
            // console.log('Debugger UI detached');
        });

        socket.on('askForLanguageModelEmit', function(obj) {
            if (!fs.existsSync(self.options.languageModelDir)) {
                console.log(`Can't find models folder`);
                return;
            }

            let languageModel = {};
            fs.readdir(self.options.languageModelDir, (err, files) => {
                for (const file of files) {
                    if (!_.endsWith(file, '.json')) {
                        continue;
                    }
                    const locale = file.substring(0, file.indexOf('.json'));
                    languageModel[locale] = require(
                        self.options.languageModelDir + path.sep + file);
                }
                socket.emit('languageModelEmit', languageModel);
            });
        });

        socket.on('sendRequest', function(obj) {
            const rb = util.getPlatformRequestBuilder(obj.platform)[0];
            let req;

            if (obj.type === 'LAUNCH') {
                req = rb.launch();
            } else if (obj.type === 'INTENT') {
                req = rb.intent(obj.options.intentName, obj.options.inputs);
            } else if (obj.type === 'RAW') {
                req = util.getPlatformRequestBuilder('AlexaSkill')[0].request(obj.json);
                req = rb.request(obj.json);
            }
            req.setLocale(obj.locale);
            req.setTimestamp((new Date()).toISOString());

            send(req).then(() => {
                // console.log('done');
            });
        });


        // this.app.on('request', (jovo) => {
        //     socket.emit('requestEmit', jovo.requestObj);
        // });

        this.app.on('afterRouting', (jovo, route) => {
            let rawText = null;

            try {
                rawText = jovo.getPlatform().getRawText();
            } catch (e) {
            }
            socket.emit('requestEmit', {
                json: jovo.requestObj,
                route: route,
                rawText: rawText,
            });
        });
        this.app.on('response', (jovo) => {
            let responseSpeech = null;
            let requestSessionAttributes = {};
            let responseSessionAttributes = {};

            try {
                responseSpeech = jovo.getPlatform().getSpeechText();
            } catch (e) {
            }

            try {
                requestSessionAttributes = jovo.getPlatform().getRequest().getSessionAttributes();
            } catch (e) {
            }

            try {
                responseSessionAttributes = jovo.getPlatform().getRequest().getSessionAttributes();
            } catch (e) {
            }

            socket.emit('responseEmit', {
                json: jovo.getPlatform().getResponseObject(),
                platformType: util.getRequestType(jovo.requestObj),
                route: jovo.handler.route,
                sessionEnded: jovo.getPlatform().getResponse().isTell(),
                inputs: jovo.getInputs(),
                requestSessionAttributes: requestSessionAttributes,
                responseSessionAttributes: responseSessionAttributes,
                speech: responseSpeech,
            });
        });

        this.app.on('handlerError', (jovo, error) => {
            socket.emit('response', {
                error: error.stack.toString(),
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
 * Helper method to find userHome directory
 * @return {*}
 */
function getUserHome() {
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

module.exports.JovoDebuggerPlugin = JovoDebuggerPlugin;
