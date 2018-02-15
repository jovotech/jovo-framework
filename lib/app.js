'use strict';

const _ = require('lodash');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');
const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const util = require('./util');

// Database implementation
const FilePersistence = require('./integrations/db/filePersistenceV2').FilePersistence;
const DynamoDb = require('./integrations/db/dynamoDb').DynamoDb;

// Integrations
const Analytics = require('./integrations/analytics/analytics');
const Db = require('./integrations/db/db').Db;
const Jovo = require('./jovo');

module.exports.TYPE_ENUM = Object.freeze({
    WEBHOOK: 'webhook',
    LAMBDA: 'lambda',
});

module.exports.PLATFORM_ENUM = Object.freeze({
    ALEXA_SKILL: 'AlexaSkill',
    GOOGLE_ACTION: 'GoogleAction',
    ALL: 'All',
});

module.exports.REQUEST_TYPE_ENUM = Object.freeze({
    LAUNCH: 'LAUNCH',
    INTENT: 'INTENT',
    ON_ELEMENT_SELECTED: 'ON_ELEMENT_SELECTED',
    ON_SIGN_IN: 'ON_SIGN_IN',
    ON_PERMISSION: 'ON_PERMISSION',
    AUDIOPLAYER: 'AUDIOPLAYER',
    END: 'END',
    ERROR: 'ERROR',
});

module.exports.DIALOGSTATE_ENUM = Object.freeze({
    STARTED: 'STARTED',
    IN_PROGRESS: 'IN_PROGRESS',
    DONE: 'DONE',
});

module.exports.HANDLER_LAUNCH = 'LAUNCH';
module.exports.HANDLER_END = 'END';
module.exports.HANDLER_ON_REQUEST = 'ON_REQUEST';
module.exports.HANDLER_NEW_USER = 'NEW_USER';
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
    i18n: {
        overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
        load: 'all',
        returnObjects: true,
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
        this.setConfig(_.cloneDeep(module.exports.DEFAULT_CONFIG));
        if (config) {
            this.setConfig(config);
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
     * @return {Jovo} this
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
     */
    handleWebhook(req, res) {
       (new Jovo.Jovo(this))
            .handleWebhook(req, res)
            .execute();
    }

    /**
     * Handles request from lambda
     * @param {*} event
     * @param {*} context
     * @param {*} callback
     */
    handleLambda(event, context, callback) {
        (new Jovo.Jovo(this))
            .handleLambda(event, context, callback)
            .execute();
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
        if (!this.config) {
            this.config = {};
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
     * TODO any idea for google actions?
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
        if (!_.isObject(config)) {
            throw new Error('db config must be an object');
        }

        if (!config.type) {
            throw new Error('db type is not defined');
        }

        if (config.type === 'file') {
            if (!config.localDbFilename || !_.isString(config.localDbFilename)) {
                throw new Error('localDbFile variable is not defined');
            }
            this.config.moduleDatabase = new Db('file', new FilePersistence(config.localDbFilename));
        } else if (config.type === 'dynamodb') {
            if (!config.tableName || !_.isString(config.tableName)) {
                throw new Error('tableName variable is not defined');
            }
            this.config.moduleDatabase = new Db('dynamodb',
                new DynamoDb(config.tableName, _.get(config, 'awsConfig', {})));
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
        this.config.userMetaData = _.assignIn(this.config.userMetaData, userMetaData);
    }

    /**
     * Sets i18n config
     * Example
     * {
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
        this.config.languageResourcesSet = true;

        this.config.i18n.resources = resources;

        let initConfig = _.assignIn(this.config.i18n, config);
        i18n
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
        this.config.moduleAnalytics = new Analytics.Analytics(analyticsConfig);
    }

    /**
     * Adds analytics implementation
     * @public
     * @param {string} name
     * @param {*} serviceConf
     */
    addAnalytics(name, serviceConf) {
        this.config.moduleAnalytics.addAnalytics(name, serviceConf);
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
        this.config.polly = config;
    }

    /**
     * Sets handler object
     * @param {Object} handlers
     */
    setHandler(handlers) {
        util.validateHandlers(handlers);
        this.config.handlers = handlers;
    }

    /**
     * Sets alexa handlers
     * @public
     * @param {*} handlers
     */
    setAlexaHandler(handlers) {
        util.validateHandlers(handlers);
        _.set(this.config, 'alexaSkill.handlers', handlers);
    }

    /**
     * Sets google action handlers
     * @public
     * @param {*} handlers
     */
    setGoogleActionHandler(handlers) {
        util.validateHandlers(handlers);
        _.set(this.config, 'googleAction.handlers', handlers);
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

