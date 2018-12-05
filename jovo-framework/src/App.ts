import {BaseApp, ExtensibleConfig} from "jovo-core";
import * as fs from 'fs';
import * as path from "path";
import * as _ from "lodash";

import {BasicLogging} from "./middleware/logging/BasicLogging";
import {JovoUser} from "./middleware/user/JovoUser";
import {I18Next} from "jovo-cms-i18next";
import {Handler} from "./middleware/Handler";
import {Router} from "./middleware/Router";

export class App extends BaseApp {
    config: AppConfig = {
        enabled: true,
        inputMap: {},
        intentMap: {},
    };

    constructor(config?: AppConfig) {
        super(config);
        this.$cms = {};
        const pathToConfig = path.join(process.cwd(), 'config.js' );
        if (fs.existsSync(pathToConfig)) {
            const fileConfig = require(pathToConfig) || {};
            // throw new Error (`Could not load default config.js in project directory`);
            this.config = _.merge(fileConfig, this.config);
        }

        let stage = process.env.STAGE || process.env.NODE_ENV;

        if (process.argv.indexOf('--stage') > -1) {
            stage = process.argv[process.argv.indexOf('--stage') + 1].trim();
        }

        const pathToStageConfig = path.join(process.cwd(), 'config.' + stage + '.js' );
        if (fs.existsSync(pathToStageConfig)) {
            const fileStageConfig = require(pathToStageConfig) || {};
            _.merge(this.config, fileStageConfig);
        }
        this.mergePluginConfiguration();
        this.v1ConfigMigration();
        this.init();
    }

    mergePluginConfiguration() {
        this.config.plugin = {};
        _.merge(this.config.plugin, this.config.platform);
        _.merge(this.config.plugin, this.config.db);
        _.merge(this.config.plugin, this.config.cms);
        _.merge(this.config.plugin, this.config.analytics);
        _.merge(this.config.plugin, this.config.nlu);

    }


    v1ConfigMigration() {
        this.config.logging = this.config.logging || _.get(this.config, 'v1.logging');
        this.config.requestLogging = this.config.requestLogging || _.get(this.config, 'v1.requestLogging');
        this.config.responseLogging = this.config.responseLogging || _.get(this.config, 'v1.responseLogging');
        this.config.requestLoggingObjects = this.config.requestLoggingObjects || _.get(this.config, 'v1.requestLoggingObjects');
        this.config.responseLoggingObjects = this.config.responseLoggingObjects || _.get(this.config, 'v1.responseLoggingObjects');

        // _.set(this.config, 'plugin.BasicLogging.logging', this.config.logging);



        _.set(this.config, 'plugin.JovoUser.implicitSave', _.get(this.config, 'plugin.JovoUser.implicitSave') || _.get(this.config, 'v1.saveUserOnResponseEnabled'));
        _.set(this.config, 'plugin.JovoUser.columnName', _.get(this.config, 'plugin.JovoUser.columnName') || _.get(this.config, 'v1.userDataCol'));

        this.config.inputMap = this.config.inputMap || _.get(this.config, 'v1.inputMap');

        _.set(this.config, 'plugin.Router.intentsToSkipUnhandled', _.get(this.config, 'plugin.Router.intentsToSkipUnhandled') || _.get(this.config, 'v1.intentsToSkipUnhandled'));
        _.set(this.config, 'plugin.Router.intentMap', this.config.intentMap || _.get(this.config, 'v1.intentMap'));

        if (_.get(this.config, 'v1.saveBeforeResponseEnabled')) {
            console.log(`'saveBeforeResponseEnabled' is deprecated since 2.0 `);
        }

        _.set(this.config, 'plugin.Alexa.allowedApplicationIds', _.get(this.config, 'plugin.Alexa.allowedApplicationIds') || _.get(this.config, 'v1.allowedApplicationIds'));

        if (_.get(this.config, 'v1.db.type') === 'file') {
            _.set(this.config, 'plugin.FileDb.pathToFile', _.get(this.config, 'plugin.FileDb.pathToFile') || `./db/${_.get(this.config, 'v1.db.localDbFilename')}.json`);
        }

        if (_.get(this.config, 'v1.db.type') === 'dynamodb') {
            _.set(this.config, 'plugin.DynamoDb.tableName', _.get(this.config, 'plugin.DynamoDb.tableName') || _.get(this.config, 'v1.db.tableName'));
            _.set(this.config, 'plugin.DynamoDb.awsConfig', _.get(this.config, 'plugin.DynamoDb.awsConfig') || _.get(this.config, 'v1.db.awsConfig'));
        }
        // TODO: google datastore

        this.config.userMetaData = this.config.userMetaData || _.get(this.config, 'v1.userMetaData');
        this.config.userContext = this.config.userContext || _.get(this.config, 'v1.userContext');

        _.set(this.config, 'plugin.I18Next', _.get(this.config, 'i18n') || _.get(this.config, 'v1.i18n'));

        // TODO: analytics
        _.set(this.config, 'plugin.Alexa', _.get(this.config, 'plugin.Alexa') || _.get(this.config, 'v1.alexSkill'));
        _.set(this.config, 'plugin.GoogleAssistant', _.get(this.config, 'plugin.GoogleAssistant') || _.get(this.config, 'v1.googleAction'));
    }

    init() {
        this.use(new BasicLogging({
            logging: _.get(this, 'config.plugin.BasicLogging.logging') || _.get(this, 'config.logging'),
            requestLogging: _.get(this, 'config.plugin.BasicLogging.requestLogging') || _.get(this, 'config.requestLogging'),
            responseLogging: _.get(this, 'config.plugin.BasicLogging.responseLogging') || _.get(this, 'config.responseLogging'),
            requestLoggingObjects: _.get(this, 'config.plugin.BasicLogging.requestLoggingObjects') || _.get(this, 'config.requestLoggingObjects'),
            responseLoggingObjects: _.get(this, 'config.plugin.BasicLogging.responseLoggingObjects') || _.get(this, 'config.responseLoggingObjects'),
        }));

        this.use(new JovoUser({
            userMetaData: this.config.userMetaData,
            userContext: this.config.userContext
        }));
        this.use(new I18Next());
        this.use(new Router());
        this.use(new Handler());
    }


    /**
     * TODO:
     * @deprecated
     * @param config
     */
    setConfig(config: AppConfig) {
    }


    /**
     * @deprecated
     * @param {boolean} val
     */
    enableLogging(val = true) {
        this.config.logging = val;
        if (this.plugins.get('BasicLogging')) {
            (this.plugins.get('BasicLogging') as BasicLogging).config.logging = val;
            _.set(this.config, 'plugins.BasicLogging.logging', val);
        }
        this.enableRequestLogging(val);
        this.enableResponseLogging(val);
    }

    /**
     * @deprecated
     * @param {boolean} val
     */
    enableRequestLogging(val = true) {
        if (this.plugins.get('BasicLogging')) {
            (this.plugins.get('BasicLogging') as BasicLogging).config.requestLogging = val;
            _.set(this.config, 'plugins.BasicLogging.requestLogging', val);
        }
        this.config.requestLogging = val;
    }

    /**
     * @deprecated
     * @param {boolean} val
     */
    enableResponseLogging(val = true) {
        if (this.plugins.get('BasicLogging')) {
            (this.plugins.get('BasicLogging') as BasicLogging).config.responseLogging = val;
            _.set(this.config, 'plugins.BasicLogging.responseLogging', val);
        }
        this.config.responseLogging = val;
    }

    /**
     * @deprecated
     * @param {string | string[]} path
     */
    setRequestLoggingObjects(path: string | string[]) {
        if (typeof path === 'string') {
            this.config.requestLoggingObjects = [path];
        } else {
            this.config.requestLoggingObjects = path;
        }

        if (this.plugins.get('BasicLogging')) {
            (this.plugins.get('BasicLogging') as BasicLogging).config.requestLoggingObjects = this.config.requestLoggingObjects;
            _.set(this.config, 'plugins.BasicLogging.logging', this.config.requestLoggingObjects);
        }

    }

    /**
     * @deprecated
     * @param {string | string[]} path
     */
    setResponseLoggingObjects(path: string | string[]) {
        if (typeof path === 'string') {
            this.config.responseLoggingObjects = [path];
        } else {
            this.config.responseLoggingObjects = path;
        }

        if (this.plugins.get('BasicLogging')) {
            (this.plugins.get('BasicLogging') as BasicLogging).config.responseLoggingObjects = this.config.responseLoggingObjects;
            _.set(this.config, 'plugins.BasicLogging.logging', this.config.responseLoggingObjects);
        }
    }

    /**
     * @deprecated
     * @param {{[p: string]: string}} inputMap
     */
    setInputMap(inputMap: {[key: string]: string}) {
        this.config.inputMap = inputMap;
    }


    /**
     * @deprecated
     * @param {UserMetaDataConfig} userMetaData
     */
    setUserMetaData(userMetaData: UserMetaDataConfig) {
        this.config.userMetaData = userMetaData;
    }

    /**
     * @deprecated
     * @param {UserContextConfig} userContext
     */
    setUserContext(userContext: UserContextConfig) {
        this.config.userContext = userContext;
    }

    /**
     * @deprecated
     * @param {{[p: string]: string}} intentMap
     */
    setIntentMap(intentMap: {[key: string]: string}) {
        this.config.intentMap = intentMap;
        if (this.plugins.get('Router')) {
            (this.plugins.get('Router') as Router).config.intentMap = this.config.intentMap;
            _.set(this.config, 'plugins.Router.intentMap', this.config.intentMap);
        }
    }

    /**
     * @deprecated
     * @param {string[]} intentsToSkipUnhandled
     */
    setIntentsToSkipUnhandled(intentsToSkipUnhandled: string[]) {
        if (this.plugins.get('Router')) {
            (this.plugins.get('Router') as Router).config.intentsToSkipUnhandled = intentsToSkipUnhandled;
            _.set(this.config, 'plugins.Router.intentsToSkipUnhandled', intentsToSkipUnhandled);
        }
    }

    /**
     * @deprecated
     * @param i18n
     */
    setI18n(i18n: any) { // tslint:disable-line
        if (this.plugins.get('I18Next')) {
            (this.plugins.get('I18Next') as I18Next).config = i18n;
            _.set(this.config, 'plugins.I18Next', i18n);
        }
    }

    /**
     * @deprecated
     * @param alexaSkillConfig
     */
    setAlexaSkill(alexaSkillConfig: any) { // tslint:disable-line
        if (this.plugins.get('Alexa')) {
            _.set(this.plugins.get('Alexa')!, 'config', alexaSkillConfig);
        }
    }

    /**
     * @deprecated
     * @param googleActionConfig
     */
    setGoogleAction(googleActionConfig: any) { // tslint:disable-line
        if (this.plugins.get('GoogleAssistant')) {
            _.set(this.plugins.get('GoogleAssistant')!, 'config', googleActionConfig);
        }
    }

    /**
     * @deprecated
     * @param dbConfig
     */
    setDb(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    setDynamoDb(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    setDynamoDbKey(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    setLanguageResources(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    setAnalytics(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    addAnalytics(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    addDashbotGoogleAction(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    addDashbotAlexa(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    addBotanalyticsGoogleAction(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    addBotanalyticsAlexa(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    addBespokenAnalytics(dbConfig: any) { // tslint:disable-line

    }

    /**
     * @deprecated
     * @param dbConfig
     */
    addChatbaseAnalytics(dbConfig: any) { // tslint:disable-line

    }

}



export interface UserMetaDataConfig {
    enabled?: boolean;
    lastUsedAt?: boolean;
    sessionsCount?: boolean;
    createdAt?: boolean;
    requestHistorySize?: number;
    devices?: boolean;
}

export interface UserContextConfig {
    enabled?: boolean;
    prev?: {
        size?: number,
        request?: {
            intent?: boolean,
            state?: boolean,
            inputs?: boolean,
            timestamp?: boolean,
        },
        response?: {
            speech?: boolean,
            reprompt?: boolean,
            state?: boolean,
            output?: boolean,
        },
    };
}

export interface AppConfig extends ExtensibleConfig {
    v1?: {
        logging?: boolean;
        requestLogging?: boolean;
        responseLogging?: boolean;
        requestLoggingObjects?: string[],
        responseLoggingObjects?: string[],

        intentMap?: {[key: string]: string};
        inputMap?: {[key: string]: string};

        intentsToSkipUnhandled: string[];
        userMetaData?: UserMetaDataConfig;
        userContext?: UserContextConfig;
        i18n: any; // tslint:disable-line
    };

    logging?: boolean;
    requestLogging?: boolean;
    responseLogging?: boolean;
    requestLoggingObjects?: string[];
    responseLoggingObjects?: string[];

    intentMap?: {[key: string]: string};
    inputMap?: {[key: string]: string};

    userMetaData?: UserMetaDataConfig;
    userContext?: UserContextConfig;

    db?: {[key: string]: any}; // tslint:disable-line
    analytics?: {[key: string]: any}; // tslint:disable-line
    platform?: {[key: string]: any}; // tslint:disable-line
    cms?: {[key: string]: any}; // tslint:disable-line
    nlu?: {[key: string]: any}; // tslint:disable-line
}
