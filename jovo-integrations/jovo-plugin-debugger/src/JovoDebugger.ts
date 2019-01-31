
import {Plugin, BaseApp, SessionData, JovoRequest, PluginConfig, HandleRequest, SessionConstants} from 'jovo-core';
import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');

import * as path from 'path';
import * as fs from 'fs';
import * as io from 'socket.io-client';
import * as util from 'util';
import * as crypto from "crypto";

const fsreadFile = util.promisify(fs.readFile);
const fsreaddir = util.promisify(fs.readdir);
const fsexists = util.promisify(fs.exists);


const WEBHOOK_URL = 'https://webhook.jovo.cloud';
process.on('unhandledRejection', (reason, p) => {
    // Stack Trace
    console.log(reason.stack);
});

export interface Config extends PluginConfig {
    database?: boolean;
    languageModel?: boolean;
    languageModelDir?: string;
    debuggerJsonPath?: string;
}

export interface JovoDebuggerRequest {
    json: any; // tslint:disable-line
    platformType: string;
    requestSessionAttributes: SessionData;
    userId: string;
    route?: any; // tslint:disable-line
    inputs?: any; // tslint:disable-line
    rawText?: string; // tslint:disable-line
    database?: any; // tslint:disable-line
    error?: any; // tslint:disable-line
}


export interface JovoDebuggerResponse {
    json: any; // tslint:disable-line
    database?: any; // tslint:disable-line
    speech?: string;
    platformType: string;
    userId: string;
    route: any; // tslint:disable-line
    sessionEnded: boolean;
    inputs: any; // tslint:disable-line
    requestSessionAttributes: any; // tslint:disable-line
    responseSessionAttributes: any; // tslint:disable-line
    audioplayer?: any; // tslint:disable-line
}

export class JovoDebugger implements Plugin {

    config: Config = {
        enabled: false,
        database: true,
        languageModel: true,
        languageModelDir: './../models',
        debuggerJsonPath: './../debugger.json',
    };
    app?: BaseApp;
    socket?: SocketIOClient.Socket;
    consoleLogOverriden = false;
    constructor(config?: Config) {

        if (config) {
            this.config = _merge(this.config, config);
        }
    }

    async install(app: BaseApp) {
        app.on('webhook.init', async () => {
            if (['--intent', '--launch', '--file', '--template'].some(r => process.argv.includes(r))) {
                handleConsoleRequest(app);
            }
        });

        if (process.argv.indexOf('--jovo-webhook') > -1 && process.argv.indexOf('--disable-jovo-debugger') === -1) {
            this.config.enabled = true;
        }
        if (!this.config.enabled) {

            return;
        }

        await this.connect();

        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }

        this.app = app;
        const self = this;
        self.consoleLogOverriden = false;
        // fired when debugger is opened in browser
        this.socket.on('readyToDebug', this.readyToDebug.bind(this));

        // is fired when the debugger asks for the language model
        this.socket.on('askForLanguageModelEmit', this.askForLanguageModelEmit.bind(this));
        this.socket.on('sendRequest', this.sendRequest.bind(this));

        app.on('after.router', this.afterRouting.bind(this));
        app.on('response', this.response.bind(this));

    }

    private async sendRequest(obj: any) { // tslint:disable-line
        const userId:string = obj.userId || 'jovo-debugger-user';
        let conv;

        if (!this.app) {
            throw new Error(`Couldn't send request. App object is not initialized.`);
        }

        const platformMap: {[key: string]: string} = {
            'AlexaSkill': 'Alexa',
            'GoogleAction': 'GoogleAssistant',
            'GoogleActionDialogFlowV2': 'GoogleAssistant',
        };

        obj.platform = platformMap[obj.platform];
        const platform = this.app.getPlatformByName(obj.platform ) || this.app.$platform.values().next().value;
        const test = platform.makeTestSuite();
        const fileDbPath = _get(this.app.$plugins.get('FileDb'), 'config.pathToFile');

        conv = _get(this, `conversations.${userId}`) ||
                test.conversation({
                    userId,
                    defaultDbDirectory: fileDbPath
                });
        let req: JovoRequest = await test.requestBuilder.launch();

        // raw json request, usually on resend
        if (obj.type === 'RAW') {
            // type of request builder doesn't matter here
            req = await test.requestBuilder.rawRequest(obj.json);
        } else {
            if (obj.type === 'LAUNCH') {
                req = await test.requestBuilder.launch();
            } else if (obj.type === 'INTENT') {
                req = await test.requestBuilder.intent(obj.options.intentName, obj.options.inputs);
            } else if (obj.type === 'END') {
                req = await test.requestBuilder.end();
            } else if (obj.type === 'AUDIOPLAYER') {
                // TODO: workaround
                if (obj.platform === 'AlexaSkill') {
                    const offsetInMilliSeconds = Math.round(obj.options.currentTime * 1000);

                    const types: {[key: string]: string} = {
                        finished: 'AudioPlayer.Finished',
                        nearlyfinished: 'AudioPlayer.PlaybackNearlyFinished',
                        paused: 'AudioPlayer.PlaybackStopped',
                        started: 'AudioPlayer.PlaybackStarted',
                    };
                    req = await test.requestBuilder.audioPlayerRequest();
                    _set(req, 'request.type', types[obj.options.type] || '');
                    _set(req, 'request.offsetInMilliseconds', offsetInMilliSeconds);

                } else if (obj.platform === 'GoogleAction') {
                    if (obj.options.type === 'finnished') {
                        req = await test.requestBuilder.audioPlayerRequest();

                    }
                }
            }
            req.setNewSession(obj.newSession);

            try {
                // alexa only
                req.setTimestamp((new Date()).toISOString());
            } catch (e) {

            }

            // set locale (not available for every request)
            try {
                req.setLocale(obj.locale);
                conv.config.locale = obj.locale;
            } catch (e) {
            }

            // TODO: needs refactoring
            try {
                if (_get(obj, 'device') === 'AlexaSkill.display') {
                    req.setScreenInterface();
                }
                if (_get(obj, 'device') === 'GoogleActionDialogFlow.phone') {
                    req.setScreenInterface();
                } else if (_get(obj, 'device') === 'GoogleActionDialogFlow.speaker') {
                    req.setAudioInterface();
                }
            } catch (e) {

            }
        }

        delete conv.config.httpOptions.headers['jovo-test'];
        const response = await conv.send(req);

        _set(this, `conversations.${userId}`, conv);

        // conv.clearDb();
    }

    private async askForLanguageModelEmit(): Promise<void> {
        if (!this.config.languageModel) {
            //TODO: emit with message to activate languagemodel
            return;
        }

        if (!this.config.languageModelDir) {
            throw new Error('languageModelDir has not been set.');
        }

        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }

        if (!this.config.debuggerJsonPath) {
            throw new Error('debuggerJsonPath has not been set.');
        }

        const languageModelDirExists = await fsexists(this.config.languageModelDir);

        if (!languageModelDirExists) {
            console.log(`Can't find models folder`);
            return;
        }

        const languageModel: any = {}; // tslint:disable-line


        const files = await fsreaddir(this.config.languageModelDir);

        for (const file of files) {
            if (!file.endsWith('.json')) {
                continue;
            }
            const locale = file.substring(0, file.indexOf('.json'));
            const fileContent:string = await fsreadFile(path.join(
                this.config.languageModelDir,
                file
            ), 'utf8');

            languageModel[locale] = JSON.parse(fileContent);
        }
        this.socket.emit('languageModelEmit', languageModel);



        const debuggerConfigExists = await fsexists(this.config.debuggerJsonPath);
        if (debuggerConfigExists) {
            const fileContent:string = await fsreadFile(this.config.debuggerJsonPath, 'utf8');

            try {
                this.socket.emit('debuggerConfig', JSON.parse(fileContent));
            } catch(e) {
                console.error(e);
            }
        }
    }

    private readyToDebug() {

        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }
        const socket = this.socket;
        // start new session
        // removeSessionAttributes();

        // skip multiple console.log overrides
        if (this.consoleLogOverriden) {
            return;
        }

        const _privateLog = console.log;

        console.log = function(message) { // tslint:disable-line
            const nMessage = typeof message !== 'string' ? JSON.stringify(message) : message;
            socket.emit('console.log', nMessage, (new Error()).stack!.toString());
            _privateLog.apply(console, arguments); // eslint-disable-line
        };
        this.consoleLogOverriden = true;
    }

    private afterRouting(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }

        const request: JovoDebuggerRequest = {
            json: handleRequest.jovo.$request,
            platformType: handleRequest.jovo.constructor.name,
            requestSessionAttributes: handleRequest.jovo.$requestSessionAttributes,
            inputs: handleRequest.jovo.$inputs,
            userId: handleRequest.jovo.$user.getId() || '',
            route: handleRequest.jovo.$plugins.Router.route,
        };

        if (this.config.database) {
            // TODO: why does declare module in jovo-framework not work?
            request.database = _get(handleRequest.jovo.$user, '$data');
        }

        try {
            request.rawText = handleRequest.jovo.getRawText();
        } catch (e) {
        }

        try {
            // TODO: googleAction?
            // request.error = handleRequest.jovo.$request.getError();
        } catch (e) {
        }
        this.socket.emit('requestEmit', request);
    }
    private response(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }
        const response: JovoDebuggerResponse = {
            json: handleRequest.jovo.$response,
            platformType: handleRequest.jovo.constructor.name === 'GoogleAction' ? 'GoogleActionDialogFlowV2' : handleRequest.jovo.constructor.name, // TODO: TEMP
            userId: handleRequest.jovo.$user!.getId() || '',
            route: handleRequest.jovo.$plugins.Router.route,
            sessionEnded: handleRequest.jovo.$response!.hasSessionEnded(),
            inputs: handleRequest.jovo.$inputs,
            requestSessionAttributes: handleRequest.jovo.$requestSessionAttributes,
            responseSessionAttributes: _get(handleRequest.jovo, '$session.$data'),
            speech: handleRequest.jovo.$response!.getSpeech(),
        };

        if (this.config.database) {
            // TODO: why does declare module in jovo-framework not work?
            response.database = _get(handleRequest.jovo.$user, '$data');
        }

        try {
            response.speech = handleRequest.jovo.$response!.getSpeech();
        } catch (e) {
        }

        // TODO: audioplayer
        try {
            response.audioplayer = _get(handleRequest.jovo.$output, `${handleRequest.jovo.constructor.name}.AudioPlayer`) || _get(handleRequest.jovo.$output, `${handleRequest.jovo.constructor.name}.MediaResponse`);
        } catch (e) {
        }

        this.socket.emit('responseEmit', response);
    }

    private async connect() {
        const webhookId = await JovoDebugger.getWebhookId();
        this.socket = io.connect(WEBHOOK_URL, {
            query: {
                id: webhookId,
                type: 'app',
            },
        });
        this.socket.on('connect', () => {
        });

        this.socket.on('connect_error', (error: Error) => {
            console.log('Sorry, there seems to be an issue with the connection!');
        });
    }

    private static async getWebhookId(): Promise<string> {
        let id;
        try {
            const content = await fsreadFile(path.join(getUserHome(), '.jovo/config'));
            id = JSON.parse(content.toString()).webhook.uuid;
        } catch (e) {
            console.log(`Couldn't load webhook id from jovo-cli config`);
            throw new Error(`Couldn't initialize jovo debugger`);
        }
        return id;
    }
    uninstall(app: BaseApp) {

    }
}
/**
 * Helper method to find userHome directory
 * @return {*}
 */
function getUserHome(): string {
    // @ts-ignore
    return process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];
}

/**
 * Handles debugger commands from console
 * @param {BaseApp} app
 * @returns {Promise<void>}
 */

async function handleConsoleRequest(app: BaseApp) {
    const program = require('commander');
    const parameters: string[] = [];
    const sessions: string[] = [];
    program
        .allowUnknownOption()
        .option('-f, --file [file]', 'path to file')
        .option('--platform [platform]', `Platform 'AlexaSkill'`, 'Alexa')
        .option('-i, --intent [intentName]', 'intent name')
        .option('-l, --launch', 'launch')
        .option('-t, --template [template]', 'template')
        .option('-w, --webhook', 'webhook')
        .option('-s, --state [state]', 'state')
        .option('-l, --locale [locale]', 'locale')
        .option('-p, --parameter [value]', 'A repeatable value', (val: string) => {
            parameters.push(val);
        }, [])
        .option('-e, --session [value]', 'Session variables', (val: string) => {
            sessions.push(val);
        }, [])
        .parse(process.argv);
    const platform = app.getPlatformByName(program.platform);

    if (!platform) {
        throw new Error(`${program.platform} is not supported.`);
    }

    const testSuite = platform.makeTestSuite();
    const conv = testSuite.conversation({
        defaultDbDirectory: './db/'
    });
    try {
        let request = await testSuite.requestBuilder.launch(); // dummy
        if (program.intent) {
            request = await testSuite.requestBuilder.intent(program.intent);
        }
        if (program.launch) {
            request = await testSuite.requestBuilder.launch();
        }
        if (program.file) {
            const file = program.file.replace(/\\/g, '/');
            request = await testSuite.requestBuilder.rawRequest(require(file));
        }
        if (program.template) {
            request = await testSuite.requestBuilder.rawRequestByKey(program.template)  ;
        }

        if (program.locale) {
            request.setLocale(program.locale);
        }

        if (program.state) {
            request.addSessionAttribute(SessionConstants.STATE, program.state);
            request.setNewSession(false);

        }
        if (parameters.length > 0) {
            for (let i = 0; i < parameters.length; i++) {
                const parameter = parameters[i].split('=');
                if (parameter.length !== 2) {
                    console.log('Invalid parameter: ' + parameters[i]);
                } else {
                    request.addInput(parameter[0], parameter[1]);
                }
            }
        }
        if (sessions.length > 0) {
            for (let i = 0; i < sessions.length; i++) {
                const session = sessions[i].split('=');
                if (session.length !== 2) {
                    console.log('Invalid session: ' + sessions[i]);
                } else {
                    request.addSessionAttribute(session[0], session[1]);
                }
            }
        }
        if (request) {
            if (conv.config.httpOptions && conv.config.httpOptions.headers) {
                delete conv.config.httpOptions.headers['jovo-test'];
            }
            conv.config.userId = `console_debugger_user-${program.platform.toLowerCase()}-${crypto.createHash('md5').update(__dirname).digest("hex")}`;
            await conv.send(request);
        }
    } catch (e) {
        console.log(e);
    }

}

