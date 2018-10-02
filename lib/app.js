'use strict';

const _ = require('lodash');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const util = require('./util');
require('dotenv').config();

// Integrations
const Analytics = require('./integrations/analytics/analytics');
const Db = require('./integrations/db/db').Db;
const BasicLogging = require('./integrations/logging/basicLogging').BasicLogging;
const RecordLogging = require('./integrations/logging/recordLogging').RecordLogging;
const JovoDebuggerPlugin = require('./integrations/logging/jovoDebugger').JovoDebuggerPlugin;
const Jovo = require('./jovo');

module.exports.TYPE_ENUM = Object.freeze({
    WEBHOOK: 'webhook',
    LAMBDA: 'lambda',
    FUNCTION: 'function',
});

module.exports.PLATFORM_ENUM = Object.freeze({
    ALEXA_SKILL: 'AlexaSkill',
    GOOGLE_ACTION: 'GoogleAction',
    ALL: 'All',
});

module.exports.REQUEST_TYPE_ENUM = Object.freeze({
    CAN_FULFILL_INTENT: 'CAN_FULFILL_INTENT',
    LAUNCH: 'LAUNCH',
    INTENT: 'INTENT',
    ON_ELEMENT_SELECTED: 'ON_ELEMENT_SELECTED',
    ON_GAME_ENGINE_INPUT_HANDLER_EVENT: 'ON_GAME_ENGINE_INPUT_HANDLER_EVENT',
    PLAYBACKCONTROLLER: 'PLAYBACKCONTROLLER',
    ON_SIGN_IN: 'ON_SIGN_IN',
    ON_PERMISSION: 'ON_PERMISSION',
    ON_EVENT: 'ON_EVENT',
    ON_PURCHASE: 'ON_PURCHASE',
    AUDIOPLAYER: 'AUDIOPLAYER',
    END: 'END',
    ERROR: 'ERROR',
    UNDEFINED: 'UNDEFINED',
    UNHANDLED: 'UNHANDLED',
});

module.exports.DIALOGSTATE_ENUM = Object.freeze({
    STARTED: 'STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
});

module.exports.HANDLER_CAN_FULFILL_INTENT = 'CAN_FULFILL_INTENT';
module.exports.HANDLER_LAUNCH = 'LAUNCH';
module.exports.HANDLER_END = 'END';
module.exports.HANDLER_ON_REQUEST = 'ON_REQUEST';
module.exports.HANDLER_NEW_USER = 'NEW_USER';
module.exports.HANDLER_ON_ELEMENT_SELECTED = 'ON_ELEMENT_SELECTED';
module.exports.HANDLER_ON_GAME_ENGINE_INPUT_HANDLER_EVENT = 'ON_GAME_ENGINE_INPUT_HANDLER_EVENT';
module.exports.HANDLER_PLAYBACKCONTROLLER = 'PLAYBACKCONTROLLER';
module.exports.HANDLER_ON_SIGN_IN = 'ON_SIGN_IN';
module.exports.HANDLER_ON_PERMISSION = 'ON_PERMISSION';
module.exports.HANDLER_ON_EVENT = 'ON_EVENT';
module.exports.HANDLER_ON_PURCHASE = 'ON_PURCHASE';

module.exports.HANDLER_AUDIOPLAYER = 'AUDIOPLAYER';
module.exports.HANDLER_MEDIARESPONSE = 'MEDIARESPONSE';

module.exports.HANDLER_NEW_SESSION = 'NEW_SESSION';

module.exports.UNHANDLED = 'Unhandled';

module.exports.STANDARD_INTENT_MAP = {
    'AMAZON.StopIntent': module.exports.HANDLER_END,
};

module.exports.DEFAULT_CONFIG = Object.freeze({
    logging: false,
    requestLogging: false,
    responseLogging: false,
    requestLoggingObjects: [],
    responseLoggingObjects: [],
    saveUserOnResponseEnabled: true,
    userDataCol: 'userData',
    inputMap: {},
    intentMap: {},
    intentsToSkipUnhandled: [],
    saveBeforeResponseEnabled: false,
    allowedApplicationIds: [],
    db: {
        type: 'file',
        localDbFilename: 'db',
    },
    userMetaData: {
        lastUsedAt: true,
        sessionsCount: true,
        createdAt: true,
        requestHistorySize: 0,
        devices: false,
    },
    userContext: {
        prev: {
            size: 1,
            request: {
                intent: true,
                state: true,
                inputs: true,
                timestamp: true,
            },
            response: {
                speech: true,
                reprompt: true,
                state: true,
            },
        },
    },
    i18n: {
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        load: 'all',
        returnObjects: true,
        interpolation: {
            escapeValue: false, // do not escape ssml tags
        },
    },
    analytics: {
        intentsToSkip: [],
        usersToSkip: [],
        services: {},
    },
    alexaSkill: {},
    googleAction: {},
});

/** Class Jovo */
class BaseApp extends EventEmitter {
    /**
     * Constructor
     * @param {Object=} config
     * @public
     */
    constructor(config) {
        super();

        if (!this.config) {
            this.config = {};
        }

        if (process.argv.indexOf('--record') > -1) {
            this.register('recordLogging', new RecordLogging(true, process.argv[process.argv.indexOf('--record') + 1]));
        }

        if (process.argv.indexOf('--jovo-webhook') > -1) {
            let projectDir = process.cwd();
            if (process.argv.indexOf('--projectDir') > -1 ) {
                projectDir = process.argv[process.argv.indexOf('--projectDir') + 1];
            }
            if (process.argv.indexOf('--disable-jovo-debugger') === -1) {
                this.register('Logging', new JovoDebuggerPlugin({languageModelDir: projectDir + path.sep + 'models', projectDir: projectDir}));
            }
        }

        this.register('basicLogging', new BasicLogging());
        this.setConfig(_.cloneDeep(module.exports.DEFAULT_CONFIG));
        if (config) {
            this.setConfig(config);
        }
        let appJsonPath = process.cwd() + path.sep + 'app.json';

        if (process.argv.indexOf('--projectDir') > -1 ) {
            appJsonPath = process.argv[process.argv.indexOf('--projectDir') + 1];
            appJsonPath += path.sep + 'app.json';
        }

        if (fs.existsSync(appJsonPath)) {
            let appJson = require(appJsonPath);

            let appJsonConfig = {};

            if (appJson.config) {
                appJsonConfig = appJson.config;
            }

            let defaultStage = process.env.STAGE || eval('`'+ appJson.defaultStage +'`');

            // prioritze stage from cli
            if (process.argv.indexOf('--stage') > -1 ) {
                defaultStage = process.argv[process.argv.indexOf('--stage') + 1];
            }

            if (_.get(appJson, `stages["${defaultStage}"].config`)) {
                appJsonConfig = _.merge(
                    appJsonConfig,
                    _.get(appJson, `stages["${defaultStage}"].config`));
            }
            this.constructor.checkEnvs(appJsonConfig);
            this.setConfig(appJsonConfig);
        }
    }

    /**
     * Helper to transform ${process.env.VAR} into process.env.VAR
     * @param {Object} obj
     */
    static checkEnvs(obj) {
        for (let key in obj) {
            if (obj.hasOwnProperty(key)) {
                if (typeof obj[key] === 'string') {
                    // check if pattern is ${var}
                    let patt = new RegExp(/\$\{(.*?)\}/);
                    if (patt.test(obj[key])) {
                        // eval is evil :)
                        obj[key] = eval('`'+ obj[key] +'`');
                    }
                } else {
                    this.checkEnvs(obj[key]);
                }
            }
        }
    }

    /**
     * ------------------------------------
     * ------------------------------------ JOVO public platform wrapper functions
     * ------------------------------------
     */

    /**
     *
     * Initializes jovo object
     *
     * @public
     * @throws Error
     * @param {object} request requestobject from the webhook or lamda
     * @param {object} response response object that is returned after execution
     * @param {object} handlers
     * @return {Jovo} new Jovo instance
     * @see {@link }
     */
    handleRequest(request, response, handlers /* backwards compatibility */) {
        if (handlers) {
            this.config.handlers = handlers;
        }
        return (new Jovo.Jovo(this))
            .handleRequest(request, response)
            .execute();
    }

    /**
     * Handles request from webhook
     * @param {*} req
     * @param {*} res
     * @return {Promise<any>}
     */
    handleWebhook(req, res) {
        return (new Jovo.Jovo(this))
            .handleWebhook(req, res)
            .execute()
            .catch((err) => {
                res.statusCode = 500;
                res.end();
                return Promise.reject(err);
            });
    }

    /**
     * Handles request from lambda
     * @param {*} event
     * @param {*} context
     * @param {*} callback
     * @return {Promise<any>}
     */
    handleLambda(event, context, callback) {
        return (new Jovo.Jovo(this))
            .handleLambda(event, context, callback)
            .execute().catch((err) => {
                console.log('handleLambda err', err);
                callback(err);
            });
    }

    /**
     * Handles request from azure functions
     * @param {*} context
     * @param {*} req
     * @return {Promise<any>}
     */
    handleFunction(context, req) {
        if (req.method === 'POST') {
            return (new Jovo.Jovo(this))
                .handleFunction(context, req)
                .execute()
                .catch(context.done);
        } else {
            context.res = {
                statusCode: 405,
                body: 'Method Not Allowed',
            };
            context.done();
            return Promise.resolve();
        }
    }
    /**
     * OnRequest Listener
     * @param {function} callback
     */
    onRequest(callback) {
        this.on('request', (jovo) => {
            callback(jovo);
        });
    }

    /**
     * OnResponse Listener
     * @param {function} callback
     */
    onResponse(callback) {
        this.on('response', (jovo) => {
            callback(jovo);
        });
    }

    /**
     * ------------------------------------
     * ------------------------------------ CONFIG
     * ------------------------------------
     */

    /**
     * Sets config for app
     * @public
     * @param {*} config
     */
    setConfig(config) {
        if (!config) {
            throw new Error('config cannot be empty');
        }

        if (typeof config.logging !== 'undefined') {
            this.enableLogging(config.logging);
        }

        if (typeof config.requestLogging !== 'undefined') {
            this.enableRequestLogging(config.requestLogging);
        }
        if (typeof config.responseLogging !== 'undefined') {
            this.enableResponseLogging(config.responseLogging);
        }
        if (typeof config.requestLoggingObjects !== 'undefined') {
            this.setRequestLoggingObjects(config.requestLoggingObjects);
        }
        if (typeof config.responseLoggingObjects !== 'undefined') {
            this.setResponseLoggingObjects(config.responseLoggingObjects);
        }
        if (typeof config.saveUserOnResponseEnabled !== 'undefined') {
            this.setSaveUserOnResponseEnabled(config.saveUserOnResponseEnabled);
        }
        if (typeof config.userDataCol !== 'undefined') {
            this.setUserDataCol(config.userDataCol);
        }
        if (typeof config.inputMap !== 'undefined') {
            this.setInputMap(config.inputMap);
        }
        if (typeof config.intentMap !== 'undefined') {
            this.setIntentMap(config.intentMap);
        }
        if (typeof config.intentsToSkipUnhandled !== 'undefined') {
            this.setIntentsToSkipUnhandled(config.intentsToSkipUnhandled);
        }
        if (typeof config.saveBeforeResponseEnabled !== 'undefined') {
            this.setSaveBeforeResponseEnabled(config.saveBeforeResponseEnabled);
        }
        if (typeof config.allowedApplicationIds !== 'undefined') {
            this.setAllowedApplicationIds(config.allowedApplicationIds);
        }
        if (typeof config.db !== 'undefined') {
            this.setDb(config.db);
        }
        if (typeof config.userMetaData !== 'undefined') {
            this.setUserMetaData(config.userMetaData);
        }
        if (typeof config.userContext !== 'undefined') {
            this.setUserContext(config.userContext);
        }
        if (typeof config.i18n !== 'undefined') {
            this.setI18n(config.i18n);
        } else {
            const i18nPath = process.cwd() + path.sep + 'app' + path.sep + 'i18n';
            if (fs.existsSync(i18nPath)) {
                let files = fs.readdirSync(i18nPath);
                let languageResources = {};
                for (let file of files) {
                    if (file.indexOf('.json') === -1) {
                        continue;
                    }
                    let locale = file.substr(0, file.indexOf('.json'));
                    languageResources[locale] = require(i18nPath + path.sep + file);
                }
                if (Object.keys(languageResources).length > 0) {
                    this.setLanguageResources(languageResources);
                }
            }
        }
        if (typeof config.analytics !== 'undefined') {
            this.setAnalytics(config.analytics);
        }

        if (typeof config.alexaSkill !== 'undefined') {
            this.setAlexaSkill(config.alexaSkill);
        }
        if (typeof config.googleAction !== 'undefined') {
            this.setGoogleAction(config.googleAction);
        }
        if (typeof config.polly !== 'undefined') {
            this.setPolly(config.polly);
        }

        if (typeof config.handlers !== 'undefined') {
            this.setHandler(config.handlers);
        }
        if (typeof config.plugins !== 'undefined') {
            this.setPlugins(config.plugins);
        }
    }

    /**
     * Returns config object
     * @return {{}}
     */
    getConfig() {
        return this.config;
    }

    /**
     * Enable or disables request AND response logging
     * @param {boolean=} val
     */
    enableLogging(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.logging = val;
        this.enableRequestLogging(val);
        this.enableResponseLogging(val);
    }

    /**
     * Activates logging of request object
     * @param {boolean=} val enables or disables request logging
     * @public
     */
    enableRequestLogging(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.plugins['basicLogging'].options.requestLogging = val;

        if (this.config.plugins['recordLogging']) {
            this.config.plugins['recordLogging'].options.requestLogging = val;
        }

        this.config.requestLogging = val;
    }

    /**
     * Activates logging response object
     * @param {boolean=} val enables or disables request logging
     * @public
     */
    enableResponseLogging(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.plugins['basicLogging'].options.responseLogging = val;

        if (this.config.plugins['recordLogging']) {
            this.config.plugins['recordLogging'].options.responseLogging = val;
        }

        this.config.responseLogging = val;
    }

    /**
     * Sets request logging objects
     * @public
     * @param {string} path
     */
    setRequestLoggingObjects(path) {
        if (_.isString(path)) {
            path = [path];
        }
        this.config.plugins['basicLogging'].options.requestLoggingObjects = path;
        this.config.requestLoggingObjects = path;
    }


    /**
     * Sets response logging objects
     * @public
     * @param {string} path
     */
    setResponseLoggingObjects(path) {
        if (_.isString(path)) {
            path = [path];
        }
        this.config.plugins['basicLogging'].options.responseLoggingObjects = path;
        this.config.responseLoggingObjects = path;
    }

    /**
     * Sets saveUserOnResponseEnabled
     * @public
     * @param {boolean} val
     */
    setSaveUserOnResponseEnabled(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.saveUserOnResponseEnabled = val;
    }

    /**
     * Sets userData col name
     * @public
     * @param {string} name
     */
    setUserDataCol(name) {
        if (!_.isString(name)) {
            throw new Error('Value must be of type string.');
        }

        this.config.userDataCol = name;
    }

    /**
     * Maps platform specific input names to custom input names
     *
     * @public
     * @param {object} inputMap
     */
    setInputMap(inputMap) {
        if (!_.isObject(inputMap)) {
            throw new Error('Input map variable must be an object');
        }
        this.config.inputMap = inputMap;
    }

    /**
     *  Maps platform specific intent names to custom intent names
     * @public
     * @param {object} intentMap
     */
    setIntentMap(intentMap) {
        if (!_.isObject(intentMap)) {
            throw new Error('Intent map variable must be an object');
        }
        this.config.intentMap = intentMap;
    }

    /**
     * Defines intents that should not be routed to Unhandled
     * @public
     * @param {Array} intents
     */
    setIntentsToSkipUnhandled(intents) {
        if (!_.isArray(intents)) {
            throw new Error('Intents variable must be an array');
        }
        this.config.intentsToSkipUnhandled = intents;
    }

    /**
     * Sets saveUserOnResponseEnabled
     * @public
     * @param {boolean} val
     */
    setSaveBeforeResponseEnabled(val) {
        if (typeof val === 'undefined') {
            val = true;
        }
        if (!_.isBoolean(val)) {
            throw new Error('Value must be of type boolean.');
        }
        this.config.saveBeforeResponseEnabled = val;
    }

    /**
     * enables saving attributes to database before response
     * @public
     * @deprecated Please use setSaveBeforeResponseEnabled(boolean)
     * @param {boolean} saveEnabled
     * @return {Jovo} this
     */
    enableSaveBeforeResponse(saveEnabled) {
        this.setSaveBeforeResponseEnabled(saveEnabled);
        return this;
    }

    /**
     * Sets applicationId id
     * Prevents request from not permitted applications
     * @deprecated
     * @public
     * @param {array} applicationIds
     */
    setAllowedApplicationIds(applicationIds) {
        if (_.isString(applicationIds)) {
            applicationIds = [applicationIds];
        }
        this.config.allowedApplicationIds = applicationIds;
    }

    /**
     * Sets configuration for the default database
     *
     * FileDB: {
     *      type: 'file',
     *      localDbFilename: 'db',
     * }
     *
     * DynamoDB: {
     *      type: 'dynamodb',
     *      tableName: 'any-table-name',
     *      awsConfig: {
     *           region: 'us-east-1',
     *           accessKeyId: 'ACCESS_KEY_ID',
     *           secretAccessKey: 'SECRET_ACCESS_KEY',
     *      }
     * }
     * @public
     * @param {*} config
     */
    setDb(config) {
        try {
            this.moduleDatabase = Db.createInstance(config);
        } catch (e) {
            // COULD to something here.
            throw e;
        }
        this.config.db = config;
    }

    /**
     * sets Dynamo DB as default db
     * @public
     * @param {string} tableName
     * @param {*} awsConfig
     */
    setDynamoDb(tableName, awsConfig) {
        this.setDb({
            type: 'dynamodb',
            tableName: tableName,
            awsConfig: awsConfig,
        });
    }

    /**
     * sets main key to save and get data from Dynamo DB
     * @public
     * @param {string} dynamoDbKey
     */
    setDynamoDbKey(dynamoDbKey) {
        this.config.dynamoDbKey = dynamoDbKey;
    }

    /**
     * @deprecated please use setDb
     * Sets local db filename
     * @public
     * @param {string} filename
     */
    setLocalDbFilename(filename) {
        this.setDb({
            type: 'file',
            localDbFilename: filename,
        });
    }

    /**
     * Sets user meta data config
     * @public
     * @param {*} userMetaData
     */
    setUserMetaData(userMetaData) {
        const validProps = [
            'lastUsedAt',
            'sessionsCount',
            'createdAt',
            'requestHistorySize',
            'devices'];

        Object.keys(userMetaData).forEach(function(item) {
            if (validProps.indexOf(item) === -1) {
                throw new Error(item + ' is not a valid userMetaData property.');
            }
        });

        if (userMetaData.lastUsedAt &&
            !_.isBoolean(userMetaData.lastUsedAt)) {
            throw new Error('lastUsedAt has to be of type boolean');
        }
        if (userMetaData.sessionsCount &&
            !_.isBoolean(userMetaData.sessionsCount)) {
            throw new Error('sessionsCount has to be of type boolean');
        }
        if (userMetaData.createdAt &&
            !_.isBoolean(userMetaData.createdAt)) {
            throw new Error('createdAt has to be of type boolean');
        }
        if (userMetaData.requestHistorySize &&
            !_.isNumber(userMetaData.requestHistorySize)) {
            throw new Error('requestHistorySize has to be of type number');
        }
        if (userMetaData.devices &&
            !_.isBoolean(userMetaData.devices)) {
            throw new Error('devices has to be of type boolean');
        }

        this.config.userMetaData = _.assignIn(this.config.userMetaData, userMetaData);
    }

    /**
     * Sets user context config
     * @param {*} userContext
     */
    setUserContext(userContext) {
        if (_.get(userContext, 'prev.request.intent') &&
            !_.isBoolean(userContext.prev.request.intent)) {
            throw new Error('intent has to be of type boolean');
        }
        if (_.get(userContext, 'prev.request.state') &&
            !_.isBoolean(userContext.prev.request.state)) {
            throw new Error('state has to be of type boolean');
        }
        if (_.get(userContext, 'prev.request.inputs') &&
            !_.isBoolean(userContext.prev.request.inputs)) {
            throw new Error('inputs has to be of type boolean');
        }
        if (_.get(userContext, 'prev.request.timestamp') &&
            !_.isBoolean(userContext.prev.request.timestamp)) {
            throw new Error('timestamp has to be of type boolean');
        }
        if (_.get(userContext, 'prev.response.speech') &&
            !_.isBoolean(userContext.prev.response.speech)) {
            throw new Error('speech has to be of type boolean');
        }
        if (_.get(userContext, 'prev.response.reprompt') &&
            !_.isBoolean(userContext.prev.response.reprompt)) {
            throw new Error('reprompt has to be of type boolean');
        }
        if (_.get(userContext, 'prev.response.state') &&
            !_.isBoolean(userContext.prev.response.state)) {
            throw new Error('state has to be of type boolean');
        }
        if (_.get(userContext, 'prev.response.timestamp') &&
            !_.isBoolean(userContext.prev.response.timestamp)) {
            throw new Error('timestamp has to be of type boolean');
        }
        if (_.get(userContext, 'prev.size')) {
            if (!_.isInteger(userContext.prev.size)) {
                throw new Error('size has to be an integer');
            } else if (userContext.prev.size < 0) {
                throw new Error('size has to be bigger than or equal to 0');
            }
        }
        this.config.userContext = _.merge(this.config.userContext, userContext);
    }

    /**
     * Sets i18n config
     * Example
     * {
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
     @public
     * @param {*} i18nConfig
     */
    setI18n(i18nConfig) {
        this.config.i18n = _.extend(this.config.i18n, i18nConfig);
        if (this.config.i18n.resources) {
            this.setLanguageResources(this.config.i18n.resources, this.config.i18n);
        }
    }

    /**
     *  Maps platform specific intent names to custom intent names
     * @public
     * @param {object} resources
     * @param {*} config custom i18next config
     */
    setLanguageResources(resources, config) {
        if (!_.isObject(resources) || _.keys(resources).length === 0) {
            throw Error('Invalid language resource.');
        }
        this.config.i18n.resources = resources;

        let initConfig = _.assignIn(this.config.i18n, config);
        this.i18n = i18n
            .use(sprintf)
            .init(initConfig);
    }

    /**
     * Sets analytics
     * Example:
     *
     * @public
     * @param {*} analyticsConfig
     */
    setAnalytics(analyticsConfig) {
        if (!_.isObject(analyticsConfig)) {
            throw new Error('Value must be of type object.');
        }
        this.config.analytics = analyticsConfig;
        this.moduleAnalytics = new Analytics.Analytics(analyticsConfig);
    }

    /**
     * Adds analytics implementation
     * @public
     * @param {string} name
     * @param {*} serviceConf
     */
    addAnalytics(name, serviceConf) {
        this.config.analytics.services[name] = serviceConf;
        this.moduleAnalytics.addAnalytics(name, serviceConf);
    }

    /**
     * Adds voicelabs analytics for alexa
     * @deprecated
     * @public
     * @param {string} token
     */
    addVoiceLabsAlexa(token) {
        this.addAnalytics('VoiceLabsAlexa', {
            key: token,
        });
    }

    /**
     * Adds voicelabs analytics for google action
     * @deprecated
     * @public
     * @param {string} token
     */
    addVoiceLabsGoogleAction(token) {
        this.addAnalytics('VoiceLabsGoogleAction', {
            key: token,
        });
    }

    /**
     * Adds dashbot analytics for google action
     * @public
     * @param {string} apiKey
     */
    addDashbotGoogleAction(apiKey) {
        this.addAnalytics('DashbotGoogleAction', {
            key: apiKey,
        });
    }

    /**
     * Adds dashbot analytics for alexa
     * @public
     * @param {string} apiKey
     */
    addDashbotAlexa(apiKey) {
        this.addAnalytics('DashbotAlexa', {
            key: apiKey,
        });
    }

    /**
     * Adds botanalytics for google action
     * @public
     * @param {string} token
     */
    addBotanalyticsGoogleAction(token) {
        this.addAnalytics('BotanalyticsGoogleAction', {
            key: token,
        });
    }

    /**
     * Adds botanalytics for alexa
     * @public
     * @param {string} token
     */
    addBotanalyticsAlexa(token) {
        this.addAnalytics('BotanalyticsAlexa', {
            key: token,
        });
    }

    /**
     * Adds Bespoken analytics
     * @public
     * @param {string} apiKey
     */
    addBespokenAnalytics(apiKey) {
        this.addAnalytics('BespokenAlexa', {
            key: apiKey,
        });
        this.addAnalytics('BespokenGoogleAction', {
            key: apiKey,
        });
    }

    /**
     * Adds Chatbase analytics
     * @public
     * @param {string} apiKey
     * @param {string} version
     */
    addChatbaseAnalytics(apiKey, version) {
        this.addAnalytics('ChatbaseAlexa', {
            key: apiKey,
            version: version ? version : '1.0',
        });
        this.addAnalytics('ChatbaseGoogleAction', {
            key: apiKey,
            version: version ? version : '1.0',
        });
    }

    /**
     * Sets Alexa Skill config
     * @param {*} alexaSkillConfig
     */
    setAlexaSkill(alexaSkillConfig) {
        this.config.alexaSkill = alexaSkillConfig;
    }

    /**
     * Sets Google Action config
     * @param {*} googleActionConfig
     */
    setGoogleAction(googleActionConfig) {
        this.config.googleAction = googleActionConfig;
    }

    /**
     * Adds polly config
     *
     * Example:
     * {
     *  s3bucket: 'bucketName',
     *  voiceId: 'Name',
     *  awsConfig: {
     *     accessKeyId: 'id',
     *     secretAccessKey: 'key',
     *     region: 'us-east-1',
     *  }
     * }
     *
     * @param {*} config
     */
    setPolly(config) {
        if (!config.s3bucket) {
            throw new Error('s3bucket has to be defined');
        }
        if (!config.voiceId) {
            throw new Error('voiceId has to be defined');
        }
        this.config.polly = config;
    }

    /**
     * Sets handler object
     * @param {Object} handlers
     */
    setHandler(handlers) {
        this.config.handlers = {};
        for (let obj of arguments) { // eslint-disable-line
            if (typeof obj !== 'object') {
                throw new Error('Handler must be of type object.');
            }
            this.config.handlers = Object.assign(this.config.handlers, obj);
        }

        if (process.argv.indexOf('--model-test') > -1 ) {
            let testLanguageModelHandler = {};
            this.enableRequestLogging(false);
            this.enableResponseLogging(false);
            testLanguageModelHandler['LAUNCH'] = function() {
                this.ask('Start');
            };
            // LAUNCH
            testLanguageModelHandler['ON_REQUEST'] = function() {
                try {
                    if (this.getPlatform().getRequestType() ===
                        module.exports.REQUEST_TYPE_ENUM.INTENT) {
                        if (this.getIntentName() ===
                            module.exports.REQUEST_TYPE_ENUM.END) {
                            this.config.handlers[
                                module.exports.REQUEST_TYPE_ENUM.END
                                ] = function() {
                                this.endSession();
                            };
                            return;
                        }

                        let inputs = this.getInputs();

                        this.config.handlers[this.getIntentName()] = function() {
                            console.log();
                            console.log('Intent:');
                            console.log('  ' + this.getIntentName());

                            if (Object.keys(inputs).length > 0) {
                                console.log();
                                console.log('Inputs:');
                            }

                            for (let key of Object.keys(inputs)) {
                                let input = this.getInput(key);
                                let out = `${key}: ${input.value ? input.value : ''}`;

                                if (_.get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code') &&
                                    _.get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code') !== 'ER_SUCCESS_MATCH') {
                                    out += ` (${_.get(input, 'alexaSkill.resolutions.resolutionsPerAuthority[0].status.code')})`;
                                }

                                console.log('  ' + out);
                            }
                            console.log();
                            console.log(' -----------------------------');

                            this.ask(this.getIntentName(), 'Say the next phrase');
                        };
                    }
                } catch (e) {
                    console.log(e);
                }
            };
            console.log();
            console.log('Language model test started...');
            console.log();
            this.config.handlers = testLanguageModelHandler;
        }
        util.validateHandlers(this.config.handlers);
    }

    /**
     * Sets alexa handlers
     * @public
     * @param {*} handlers
     */
    setAlexaHandler(handlers) {
        _.set(this.config, 'alexaSkill.handlers', {});

        for (let obj of arguments) { // eslint-disable-line
            if (typeof obj !== 'object') {
                throw new Error('Handler must be of type object.');
            }
            this.config.alexaSkill.handlers =
                _.merge(this.config.alexaSkill.handlers, obj);
        }

        util.validateHandlers(this.config.alexaSkill.handlers);
    }

    /**
     * Sets google action handlers
     * @public
     * @param {*} handlers
     */
    setGoogleActionHandler(handlers) {
        _.set(this.config, 'googleAction.handlers', {});

        for (let obj of arguments) { // eslint-disable-line
            if (typeof obj !== 'object') {
                throw new Error('Handler must be of type object.');
            }
            this.config.googleAction.handlers =
                _.merge(this.config.googleAction.handlers, obj);
        }

        util.validateHandlers(this.config.googleAction.handlers);
    }

    /**
     * Registers plugin
     * @param {string} name
     * @param {*} listener
     */
    register(name, listener) {
        if (typeof name === 'object') {
            listener = name;
            name = listener.constructor.name;
        }
        if (!this.config.plugins) {
            this.config.plugins = {};
        }

        if (!this.config.plugins[name]) {
            this.config.plugins[name] = listener;
            listener.setApp(this);
        } else {
            console.log('Warning: There is already a plugin registered with name: ' + name);
        }
    }

    /**
     * Sets plugins
     * @param {*} plugins
     */
    setPlugins(plugins) {
        this.config.plugins = plugins;
    }

    /**
     * Helper method.
     * Returns true if --webhook is in process arguments
     * @return {string}
     */
    isWebhook() {
        return process.argv.indexOf('--webhook') > -1 ? 'webhook' : '';
    };


    /**
     * ------- v0.X DEPRECATION notice
     */

    /**
     * Deprecated tell method
     * @Deprecated
     * @param {*} text
     */
    tell(text) {
        console.log();
        console.log('========================');
        console.log('=');
        console.log('=  app.tell(text) is deprecated since v1.0.0');
        console.log('=');
        console.log('=  New version:');
        console.log('=  this.tell(text)');
        console.log('=');
        console.log('========================');
    }

    /**
     * Deprecated ask method
     * @Deprecated
     * @param {*} text
     * @param {*} reprompt
     */
    ask(text, reprompt) {
        console.log();
        console.log('app.ask(text, reprompt) is deprecated since v1.0.0');
        console.log('please use this.ask(text, reprompt)');
        console.log();
    }

    /**
     * Deprecated tell method
     * @Deprecated
     * @param {*} intentName
     */
    toIntent(intentName) {
        console.log();
        console.log('app.toIntent(intentName) is deprecated since v1.0.0');
        console.log('please use this.toIntent(intentName)');
        console.log();
    }

    /**
     * Deprecated ask method
     * @Deprecated
     * @param {*} stateName
     * @param {*} intentName
     */
    toStateIntent(stateName, intentName) {
        console.log();
        console.log('app.toStateIntent(stateName, intentName) is deprecated since v1.0.0');
        console.log('please use this.toStateIntent(stateName, intentName)');
        console.log();
    }
}

module.exports.App = BaseApp;
