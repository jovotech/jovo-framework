import {BaseApp, ExtensibleConfig, Host} from "jovo-core";
import * as fs from 'fs';
import * as path from "path";
import _merge = require('lodash.merge');
import _get = require('lodash.get');
import _set = require('lodash.set');
import {FileDb2} from "jovo-db-filedb";
import {
    Config as JovoUserConfig,
    ContextConfig,
    MetaDataConfig} from "./middleware/user/JovoUser";

import {BasicLogging} from "./middleware/logging/BasicLogging";
import {JovoUser} from "./middleware/user/JovoUser";
import {I18Next, Config as I18NextConfig} from "jovo-cms-i18next";
import {Handler} from "./middleware/Handler";
import {Router, Config as RouterConfig} from "./middleware/Router";
import {UserContextConfig} from "../dist/jovo-framework/src/App";

export class App extends BaseApp {
    config: Config = {
        enabled: true,
        plugin: {},
        inputMap: {},
        intentMap: {},
    };

    constructor(config?: Config) {
        super(config);
        this.$cms = {};
        if (config) {
            this.config = _merge(this.config, config);
        }


        const pathToConfig = path.join(process.cwd(), 'config.js' );
        if (fs.existsSync(pathToConfig)) {
            const fileConfig = require(pathToConfig) || {};
            // throw new Error (`Could not load default config.js in project directory`);
            this.config = _merge(fileConfig, this.config);
        }

        let stage = process.env.STAGE || process.env.NODE_ENV;

        if (process.argv.indexOf('--stage') > -1) {
            stage = process.argv[process.argv.indexOf('--stage') + 1].trim();
        }

        const pathToStageConfig = path.join(process.cwd(), 'config.' + stage + '.js' );
        if (fs.existsSync(pathToStageConfig)) {
            const fileStageConfig = require(pathToStageConfig) || {};
            _merge(this.config, fileStageConfig);
        }

        this.mergePluginConfiguration();
        this.v1ConfigMigration();
        this.initConfig();
        this.init();
    }

    mergePluginConfiguration() {
        this.config.plugin = {};
        _merge(this.config.plugin, this.config.platform);
        _merge(this.config.plugin, this.config.db);
        _merge(this.config.plugin, this.config.cms);
        _merge(this.config.plugin, this.config.analytics);
        _merge(this.config.plugin, this.config.nlu);

    }

    initConfig() {
        if (!this.config.plugin) {
            this.config.plugin = {};
        }

        // logging
        if (typeof this.config.logging !== 'undefined') {
            if (typeof this.config.logging === 'boolean') {
                this.config.plugin.BasicLogging = {
                    logging: this.config.logging
                };
            } else {
                this.config.plugin.BasicLogging = this.config.logging;
            }
        }

        // user
        if (typeof this.config.user !== 'undefined') {
            this.config.plugin.JovoUser = this.config.user;
            if (this.config.user.metaData) {
                if (typeof this.config.user.metaData === 'boolean') {
                    if (!this.config.plugin.JovoUser.metaData) {
                        this.config.plugin.JovoUser.metaData = {};
                    }
                    this.config.plugin.JovoUser.metaData = {
                        enabled: this.config.user.metaData,
                    };


                } else {
                    this.config.plugin.JovoUser.metaData = this.config.user.metaData;
                }
            }

            if (this.config.user.context) {
                if (typeof this.config.user.context === 'boolean') {
                    if (!this.config.plugin.JovoUser.context) {
                        this.config.plugin.JovoUser.context = {};
                    }
                    this.config.plugin.JovoUser.context = {
                        enabled: this.config.user.context
                    };

                } else {
                    this.config.plugin.JovoUser.context = this.config.user.context;
                }
            }

            console.log(this.config.plugin.JovoUser);
        }

        // inputMap

        // router (intentMap)
        if (this.config.intentMap) {
            if (!this.config.plugin.Router) {
                this.config.plugin.Router = {};
            }
            this.config.plugin.Router.intentMap = this.config.intentMap;
        }
        // router (intentsToSkipUnhandled)
        if (this.config.intentsToSkipUnhandled) {
            if (!this.config.plugin.Router) {
                this.config.plugin.Router = {};
            }
            this.config.plugin.Router.intentsToSkipUnhandled = this.config.intentsToSkipUnhandled;
        }

        // i18next
        if (this.config.i18n) {
            this.config.plugin.I18Next = this.config.i18n;
        }

    }


    v1ConfigMigration() {
        if (this.config.v1) {
            _set(this.config, 'plugin.JovoUser.implicitSave', _get(this.config, 'plugin.JovoUser.implicitSave') || _get(this.config, 'v1.saveUserOnResponseEnabled'));
            _set(this.config, 'plugin.JovoUser.columnName', _get(this.config, 'plugin.JovoUser.columnName') || _get(this.config, 'v1.userDataCol'));
            _set(this.config, 'inputMap', this.config.inputMap || _get(this.config, 'v1.inputMap'));
            _set(this.config, 'plugin.Router.intentsToSkipUnhandled', _get(this.config, 'plugin.Router.intentsToSkipUnhandled') || _get(this.config, 'v1.intentsToSkipUnhandled'));
            _set(this.config, 'plugin.Router.intentMap', this.config.intentMap || _get(this.config, 'v1.intentMap'));


            if (_get(this.config, 'v1.saveBeforeResponseEnabled')) {
                console.log(`'saveBeforeResponseEnabled' is deprecated since 2.0 `);
            }
            if (_get(this.config, 'v1.db.type') === 'file') {
                _set(this.config, 'plugin.FileDb.pathToFile', _get(this.config, 'plugin.FileDb.pathToFile') || `./db/${_get(this.config, 'v1.db.localDbFilename')}.json`);
            }

            if (_get(this.config, 'v1.db.type') === 'dynamodb') {
                _set(this.config, 'plugin.DynamoDb.tableName', _get(this.config, 'plugin.DynamoDb.tableName') || _get(this.config, 'v1.db.tableName'));
                _set(this.config, 'plugin.DynamoDb.awsConfig', _get(this.config, 'plugin.DynamoDb.awsConfig') || _get(this.config, 'v1.db.awsConfig'));
            }

            _set(this.config, 'plugin.JovoUser.metaData', _get(this.config, 'plugin.JovoUser.metaData') || _get(this.config, 'v1.userMetaData'));
            _set(this.config, 'plugin.JovoUser.context', _get(this.config, 'plugin.JovoUser.context') || _get(this.config, 'v1.userContext'));
            _set(this.config, 'plugin.I18Next', _get(this.config, 'plugin.I18Next') || _get(this.config, 'v1.i18n'));
            _set(this.config, 'plugin.Alexa', _get(this.config, 'plugin.Alexa') || _get(this.config, 'v1.alexaSkill'));
            _set(this.config, 'plugin.GoogleAssistant', _get(this.config, 'plugin.GoogleAssistant') || _get(this.config, 'v1.googleAction'));
        }
    }

    init() {
        this.use(new BasicLogging());
        this.use(new JovoUser());
        this.use(new I18Next());
        this.use(new Router());
        this.use(new Handler());
    }

    async handle(hostwrapper: Host) {
        if (hostwrapper.headers['jovo-test']) {
            this.use(new FileDb2({
                path: './../db/tests'
            }));
        }
        super.handle(hostwrapper);
    }
    /**
     * TODO:
     * @deprecated
     * @param config
     */
    setConfig(config: Config) {
        this.config = _merge(this.config, config);
        this.mergePluginConfiguration();
        this.v1ConfigMigration();
        this.init();
    }


    /**
     * @deprecated
     * @param {boolean} val
     */
    enableLogging(val = true) {
        this.config.logging = val;
        if (this.$plugins.get('BasicLogging')) {
            (this.$plugins.get('BasicLogging') as BasicLogging).config.logging = val;
            _set(this.config, 'plugin.BasicLogging.logging', val);
        }
        this.enableRequestLogging(val);
        this.enableResponseLogging(val);
    }

    /**
     * @deprecated
     * @param {boolean} val
     */
    enableRequestLogging(val = true) {
        if (this.$plugins.get('BasicLogging')) {
            (this.$plugins.get('BasicLogging') as BasicLogging).config.request = val;
            _set(this.config, 'plugin.BasicLogging.requestLogging', val);
        }
        // this.config.request = val;
    }

    /**
     * @deprecated
     * @param {boolean} val
     */
    enableResponseLogging(val = true) {
        if (this.$plugins.get('BasicLogging')) {
            (this.$plugins.get('BasicLogging') as BasicLogging).config.response = val;
            _set(this.config, 'plugin.BasicLogging.responseLogging', val);
        }
        // this.config.responseLogging = val;
    }

    /**
     * @deprecated
     * @param {string | string[]} path
     */
    setRequestLoggingObjects(path: string | string[]) {
        if (typeof path === 'string') {
            // this.config.requestLoggingObjects = [path];
        } else {
            // this.config.requestLoggingObjects = path;
        }

        if (this.$plugins.get('BasicLogging')) {
            // (this.$plugins.get('BasicLogging') as BasicLogging).config.requestLoggingObjects = this.config.requestLoggingObjects;
            // _set(this.config, 'plugin.BasicLogging.logging', this.config.requestLoggingObjects);
        }

    }

    /**
     * @deprecated
     * @param {string | string[]} path
     */
    setResponseLoggingObjects(path: string | string[]) {
        if (typeof path === 'string') {
            // this.config.responseLoggingObjects = [path];
        } else {
            // this.config.responseLoggingObjects = path;
        }

        if (this.$plugins.get('BasicLogging')) {
            // (this.$plugins.get('BasicLogging') as BasicLogging).config.responseLoggingObjects = this.config.responseLoggingObjects;
            // _set(this.config, 'plugin.BasicLogging.logging', this.config.responseLoggingObjects);
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
    setUserMetaData(userMetaData: MetaDataConfig) {
        if (!this.config.user) {
            this.config.user = {};
        }
        this.config.user.metaData = userMetaData;
    }

    /**
     * @deprecated
     * @param {UserContextConfig} userContext
     */
    setUserContext(userContext: UserContextConfig) {
        if (!this.config.user) {
            this.config.user = {};
        }
        this.config.user.context = userContext;
    }

    /**
     * @deprecated
     * @param {{[p: string]: string}} intentMap
     */
    setIntentMap(intentMap: {[key: string]: string}) {
        this.config.intentMap = intentMap;
        if (this.$plugins.get('Router')) {
            (this.$plugins.get('Router') as Router).config.intentMap = this.config.intentMap;
            _set(this.config, 'plugin.Router.intentMap', this.config.intentMap);
        }
    }

    /**
     * @deprecated
     * @param {string[]} intentsToSkipUnhandled
     */
    setIntentsToSkipUnhandled(intentsToSkipUnhandled: string[]) {
        if (this.$plugins.get('Router')) {
            (this.$plugins.get('Router') as Router).config.intentsToSkipUnhandled = intentsToSkipUnhandled;
            _set(this.config, 'plugin.Router.intentsToSkipUnhandled', intentsToSkipUnhandled);
        }
    }

    /**
     * @deprecated
     * @param i18n
     */
    setI18n(i18n: any) { // tslint:disable-line
        if (this.$plugins.get('I18Next')) {
            (this.$plugins.get('I18Next') as I18Next).config = i18n;
            _set(this.config, 'plugin.I18Next', i18n);
        }
    }

    /**
     * @deprecated
     * @param alexaSkillConfig
     */
    setAlexaSkill(alexaSkillConfig: any) { // tslint:disable-line
        if (this.$plugins.get('Alexa')) {
            _set(this.$plugins.get('Alexa')!, 'config', alexaSkillConfig);
        }
    }

    /**
     * @deprecated
     * @param googleActionConfig
     */
    setGoogleAction(googleActionConfig: any) { // tslint:disable-line
        if (this.$plugins.get('GoogleAssistant')) {
            _set(this.$plugins.get('GoogleAssistant')!, 'config', googleActionConfig);
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




export interface LoggingConfig {
    request?: boolean;
    response?: boolean;
    requestObjects?: string[];
    responseObjects?: string[];
}
export interface Config extends ExtensibleConfig {
    v1?: {
        logging?: boolean;
        requestLogging?: boolean;
        responseLogging?: boolean;
        requestLoggingObjects?: string[],
        responseLoggingObjects?: string[],

        intentMap?: {[key: string]: string};
        inputMap?: {[key: string]: string};

        intentsToSkipUnhandled: string[];
        userMetaData?: MetaDataConfig;
        userContext?: ContextConfig;
        i18n: any; // tslint:disable-line
    };

    logging?: boolean | LoggingConfig;

    inputMap?: {[key: string]: string};

    user?: JovoUserConfig | {[key: string]: any; metaData: boolean; context: boolean}; // tslint:disable-line
    i18n?: I18NextConfig;
    db?: {[key: string]: any}; // tslint:disable-line
    analytics?: {[key: string]: any}; // tslint:disable-line
    platform?: {[key: string]: any}; // tslint:disable-line
    cms?: {[key: string]: any}; // tslint:disable-line
    nlu?: {[key: string]: any}; // tslint:disable-line
}

// handler
export interface Config {
    handlers?: any; // tslint:disable-line
}
export interface Config extends RouterConfig {}
