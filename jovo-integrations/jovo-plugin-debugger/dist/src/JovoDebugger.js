"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const crypto = require("crypto");
const fs = require("fs");
const jovo_core_1 = require("jovo-core");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const path = require("path");
const io = require("socket.io-client");
const stripAnsi = require("strip-ansi");
const util = require("util");
const fsreadFile = util.promisify(fs.readFile);
const fsreaddir = util.promisify(fs.readdir);
const fsexists = util.promisify(fs.exists);
const WEBHOOK_URL = 'https://webhook.jovo.cloud';
process.on('unhandledRejection', (reason, p) => {
    // Stack Trace
    if (reason) {
        if (reason.stack) {
            jovo_core_1.Log.error(reason.stack);
        }
        jovo_core_1.Log.error(reason);
    }
});
class JovoDebugger {
    constructor(config) {
        this.config = {
            database: true,
            debuggerJsonPath: './../debugger.json',
            enabled: false,
            languageModel: true,
            languageModelDir: './../models',
        };
        this.consoleLogOverriden = false;
        if (config) {
            this.config = _merge(this.config, config);
        }
        if (process.argv.indexOf('--jovo-webhook') > -1 &&
            process.argv.indexOf('--disable-jovo-debugger') === -1) {
            this.config.enabled = true;
        }
        // e.g. npm run launch
        if (process.argv.indexOf('--webhook') > -1 &&
            ['--intent', '--launch', '--file', '--template'].some((r) => process.argv.includes(r))) {
            this.config.enabled = true;
        }
    }
    static async getWebhookId() {
        let id;
        try {
            const content = await fsreadFile(path.join(getUserHome(), '.jovo/config'));
            id = JSON.parse(content.toString()).webhook.uuid;
        }
        catch (e) {
            jovo_core_1.Log.warn(`Couldn't load webhook id from jovo-cli config`);
            throw new Error(`Couldn't initialize jovo debugger`);
        }
        return id;
    }
    async install(app) {
        app.on('webhook.init', async () => {
            if (['--intent', '--launch', '--file', '--template'].some((r) => process.argv.includes(r))) {
                handleConsoleRequest(app);
            }
        });
        if (!this.config.enabled) {
            return;
        }
        await this.connect();
        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }
        this.app = app;
        const self = this; // tslint:disable-line:no-this-assignment
        self.consoleLogOverriden = false;
        // fired when debugger is opened in browser
        this.socket.on('readyToDebug', this.readyToDebug.bind(this));
        // is fired when the debugger asks for the language model
        this.socket.on('askForLanguageModelEmit', this.askForLanguageModelEmit.bind(this));
        this.socket.on('sendRequest', this.sendRequest.bind(this));
        app.on('after.router', this.afterRouting.bind(this));
        app.on('response', this.response.bind(this));
    }
    async sendRequest(obj) {
        // tslint:disable-line
        const userId = obj.userId || 'jovo-debugger-user';
        let conv;
        if (!this.app) {
            throw new Error(`Couldn't send request. App object is not initialized.`);
        }
        const platformMap = {
            AlexaSkill: 'Alexa',
            ConversationalActions: 'GoogleAssistant',
            GoogleAction: 'GoogleAssistant',
            GoogleActionDialogFlowV2: 'GoogleAssistant',
        };
        obj.platform = platformMap[obj.platform];
        const platform = this.app.getPlatformByName(obj.platform) || this.app.$platform.values().next().value;
        const test = platform.makeTestSuite();
        const fileDbPath = _get(this.app.$plugins.get('FileDb'), 'config.pathToFile');
        conv =
            _get(this, `conversations.${userId}`) ||
                test.conversation({
                    defaultDbDirectory: fileDbPath,
                    userId,
                });
        let req = await test.requestBuilder.launch();
        // raw json request, usually on resend
        if (obj.type === 'RAW') {
            // type of request builder doesn't matter here
            req = await test.requestBuilder.rawRequest(obj.json);
        }
        else {
            if (obj.type === 'LAUNCH') {
                req = await test.requestBuilder.launch();
            }
            else if (obj.type === 'INTENT') {
                req = await test.requestBuilder.intent(obj.options.intentName, obj.options.inputs);
                if (obj.platform === 'AlexaSkill' || 'Alexa') {
                    if (obj.options.alexaSkill && obj.options.alexaSkill.slots) {
                        // tslint:disable-next-line:forin
                        for (const slotName in obj.options.alexaSkill.slots) {
                            const slot = obj.options.alexaSkill.slots[slotName];
                            if (slot.key.length > 0) {
                                const id = slot.id.length > 0 ? slot.id : jovo_core_1.Util.randomStr();
                                const resolution = {
                                    resolutionsPerAuthority: [
                                        {
                                            authority: `amzn1.er-authority.echo-sdk.amzn1.ask.skill.a0541091-e492-4314-a8f1-c746e8666ee6.${slotName}`,
                                            status: {
                                                code: 'ER_SUCCESS_MATCH',
                                            },
                                            values: [
                                                {
                                                    value: {
                                                        id,
                                                        name: slot.key,
                                                    },
                                                },
                                            ],
                                        },
                                    ],
                                };
                                _set(req, `request.intent.slots.${slotName}.resolutions`, resolution);
                            }
                        }
                    }
                }
            }
            else if (obj.type === 'END') {
                req = await test.requestBuilder.end();
            }
            else if (obj.type === 'AUDIOPLAYER') {
                // TODO: workaround
                if (obj.platform === 'AlexaSkill' || obj.platform === 'Alexa') {
                    const offsetInMilliSeconds = Math.round(obj.options.currentTime * 1000);
                    const types = {
                        finished: 'AudioPlayer.PlaybackFinished',
                        nearlyfinished: 'AudioPlayer.PlaybackNearlyFinished',
                        paused: 'AudioPlayer.PlaybackStopped',
                        started: 'AudioPlayer.PlaybackStarted',
                    };
                    req = await test.requestBuilder.audioPlayerRequest();
                    _set(req, 'request.type', types[obj.options.type] || '');
                    _set(req, 'request.offsetInMilliseconds', offsetInMilliSeconds);
                }
                else if (obj.platform === 'GoogleAction') {
                    if (obj.options.type === 'finnished') {
                        req = await test.requestBuilder.audioPlayerRequest();
                    }
                }
            }
            req.setNewSession(obj.newSession);
            try {
                // alexa only
                req.setTimestamp(new Date().toISOString());
            }
            catch (e) {
                // ignore error here
            }
            // set locale (not available for every request)
            try {
                req.setLocale(obj.locale);
                conv.config.locale = obj.locale;
            }
            catch (e) {
                // ignore error here
            }
            // TODO: needs refactoring
            try {
                if (_get(obj, 'device') === 'AlexaSkill.display') {
                    req.setScreenInterface();
                }
                if (_get(obj, 'device') === 'GoogleActionDialogFlow.phone') {
                    req.setScreenInterface();
                }
                else if (_get(obj, 'device') === 'GoogleActionDialogFlow.speaker') {
                    req.setAudioInterface();
                }
                else if (_get(obj, 'device') === 'ConversationalActions.phone') {
                    req.setAudioInterface();
                    req.setScreenInterface();
                    try {
                        // @ts-ignore
                        req.setWebBrowserInterface();
                    }
                    catch (e) {
                        // ignore error here
                    }
                }
                else if (_get(obj, 'device') === 'ConversationalActions.speaker') {
                    req.setAudioInterface();
                }
                else if (_get(obj, 'device') === 'ConversationalActions.display') {
                    req.setAudioInterface();
                    req.setScreenInterface();
                }
            }
            catch (e) {
                // ignore error here
            }
        }
        delete conv.config.httpOptions.headers['jovo-test'];
        conv.config.httpOptions.headers['jovo-debugger'] = true;
        const response = await conv.send(req);
        _set(this, `conversations.${userId}`, conv);
        // conv.clearDb();
    }
    async askForLanguageModelEmit() {
        if (!this.config.languageModel) {
            // TODO: emit with message to activate languagemodel
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
            // changes default language model directory when the project is in typescript
            const DEFAULT_LANGUAGE_MODEL_DIR = './../models';
            if ((this.config.languageModelDir === DEFAULT_LANGUAGE_MODEL_DIR &&
                process.cwd().indexOf('\\dist\\') > -1) ||
                process.cwd().indexOf('/dist/') > -1) {
                this.config.languageModelDir = this.config.languageModelDir.replace('./../', './../../');
            }
            const tsLanguageModelDirExists = await fsexists(this.config.languageModelDir);
            if (!tsLanguageModelDirExists) {
                jovo_core_1.Log.warn(`Can't find models folder`);
                jovo_core_1.Log.warn('Defaultfolder: /project/models');
                jovo_core_1.Log.warn();
                jovo_core_1.Log.warn('You can set a custom folder:');
                jovo_core_1.Log.warn(`
                    app.use(
                        new JovoDebugger({
                                languageModelDir: '<dir>'
                            });
                    )`);
            }
            return;
        }
        const languageModel = {}; // tslint:disable-line
        const files = await fsreaddir(this.config.languageModelDir);
        for (const file of files) {
            if (!file.endsWith('.json') && !file.endsWith('.js')) {
                continue;
            }
            if (file.endsWith('.json')) {
                const locale = file.substring(0, file.indexOf('.json'));
                const fileContent = await fsreadFile(path.join(this.config.languageModelDir, file), 'utf8');
                languageModel[locale] = JSON.parse(fileContent);
            }
            else if (file.endsWith('.js')) {
                const locale = file.substring(0, file.indexOf('.js'));
                languageModel[locale] = require(path.join(process.cwd(), this.config.languageModelDir, file));
            }
        }
        this.socket.emit('languageModelEmit', languageModel);
        const debuggerConfigExists = await fsexists(this.config.debuggerJsonPath);
        if (debuggerConfigExists) {
            const fileContent = await fsreadFile(this.config.debuggerJsonPath, 'utf8');
            try {
                this.socket.emit('debuggerConfig', JSON.parse(fileContent));
            }
            catch (e) {
                jovo_core_1.Log.error(e);
            }
        }
    }
    readyToDebug() {
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
        const oldConsoleLog = console.log; // tslint:disable-line:no-console
        // tslint:disable-next-line
        console.log = function (...args) {
            const rawMessage = args.reduce((prev, current, index) => {
                return `${prev}${index === 0 ? '' : '  '}${typeof current !== 'string' ? JSON.stringify(current) : current}`;
            }, '');
            const message = stripAnsi(rawMessage);
            socket.emit('console.log', message, new Error().stack.toString());
            oldConsoleLog.call(this, ...args);
        };
        this.consoleLogOverriden = true;
    }
    afterRouting(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }
        const request = {
            inputs: handleRequest.jovo.$inputs,
            json: handleRequest.jovo.$request,
            platformType: handleRequest.jovo.constructor.name,
            requestSessionAttributes: handleRequest.jovo.$requestSessionAttributes,
            route: handleRequest.jovo.$plugins.Router.route,
            userId: handleRequest.jovo.$user.getId() || '',
        };
        if (this.config.database) {
            // TODO: why does declare module in jovo-framework not work?
            request.database = _get(handleRequest.jovo.$user, '$data');
        }
        try {
            request.rawText = handleRequest.jovo.getRawText();
        }
        catch (e) {
            // ignore error here
        }
        try {
            // TODO: googleAction?
            // request.error = handleRequest.jovo.$request.getError();
        }
        catch (e) {
            // ignore error here
        }
        this.socket.emit('requestEmit', request);
    }
    response(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (!this.socket) {
            throw new Error(`Couldn't initialize socket io.`);
        }
        const response = {
            inputs: handleRequest.jovo.$inputs,
            json: handleRequest.jovo.$response,
            platformType: handleRequest.jovo.constructor.name === 'GoogleAction'
                ? 'GoogleActionDialogFlowV2'
                : handleRequest.jovo.constructor.name,
            requestSessionAttributes: handleRequest.jovo.$requestSessionAttributes,
            responseSessionAttributes: _get(handleRequest.jovo, '$session.$data'),
            route: handleRequest.jovo.$plugins.Router.route,
            sessionEnded: handleRequest.jovo.$response.hasSessionEnded(),
            speech: handleRequest.jovo.$response.getSpeech(),
            userId: handleRequest.jovo.$user.getId() || '',
        };
        if (this.config.database) {
            // TODO: why does declare module in jovo-framework not work?
            response.database = _get(handleRequest.jovo.$user, '$data');
        }
        try {
            response.speech = handleRequest.jovo.$response.getSpeech();
        }
        catch (e) {
            // ignore error here
        }
        try {
            response.audioplayer =
                _get(handleRequest.jovo.$output, `Alexa.AudioPlayer`) ||
                    _get(handleRequest.jovo.$output, `GoogleAssistant.MediaResponse`);
        }
        catch (e) {
            // ignore error here
        }
        this.socket.emit('responseEmit', response);
    }
    async connect() {
        const webhookId = await JovoDebugger.getWebhookId();
        this.socket = io.connect(WEBHOOK_URL, {
            query: {
                id: webhookId,
                type: 'app',
            },
        });
        this.socket.on('connect', () => {
            // do nothing on connect
        });
        this.socket.on('connect_error', (error) => {
            jovo_core_1.Log.error('Sorry, there seems to be an issue with the connection!');
        });
    }
}
exports.JovoDebugger = JovoDebugger;
/**
 * Helper method to find userHome directory
 * @return {*}
 */
function getUserHome() {
    // @ts-ignore
    return process.env[process.platform === 'win32' ? 'USERPROFILE' : 'HOME'];
}
/**
 * Handles debugger commands from console
 * @param {BaseApp} app
 * @returns {Promise<void>}
 */
async function handleConsoleRequest(app) {
    const program = require('commander');
    const parameters = [];
    const sessions = [];
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
        .option('-p, --parameter [value]', 'A repeatable value', (val) => {
        parameters.push(val);
    }, [])
        .option('-e, --session [value]', 'Session variables', (val) => {
        sessions.push(val);
    }, [])
        .parse(process.argv);
    const platform = app.getPlatformByName(program.platform);
    if (!platform) {
        throw new Error(`${program.platform} is not supported.`);
    }
    const testSuite = platform.makeTestSuite();
    const conv = testSuite.conversation({
        defaultDbDirectory: './db/',
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
            request = await testSuite.requestBuilder.rawRequestByKey(program.template);
        }
        if (program.locale) {
            request.setLocale(program.locale);
            conv.config.locale = program.locale;
        }
        if (program.state) {
            request.addSessionAttribute(jovo_core_1.SessionConstants.STATE, program.state);
            request.setNewSession(false);
        }
        if (parameters.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < parameters.length; i++) {
                const parameter = parameters[i].split('=');
                if (parameter.length !== 2) {
                    jovo_core_1.Log.error('Invalid parameter: ' + parameters[i]);
                }
                else {
                    request.addInput(parameter[0], parameter[1]);
                }
            }
        }
        if (sessions.length > 0) {
            // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < sessions.length; i++) {
                const session = sessions[i].split('=');
                if (session.length !== 2) {
                    jovo_core_1.Log.error('Invalid session: ' + sessions[i]);
                }
                else {
                    request.addSessionAttribute(session[0], session[1]);
                }
            }
        }
        if (request) {
            if (conv.config.httpOptions && conv.config.httpOptions.headers) {
                delete conv.config.httpOptions.headers['jovo-test'];
            }
            conv.config.userId = `console_debugger_user-${program.platform.toLowerCase()}-${crypto
                .createHash('md5')
                .update(__dirname)
                .digest('hex')}`;
            await conv.send(request);
        }
    }
    catch (e) {
        jovo_core_1.Log.error(e);
    }
}
//# sourceMappingURL=JovoDebugger.js.map