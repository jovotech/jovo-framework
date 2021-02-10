"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const jovo_core_1 = require("jovo-core");
const colorize = require("json-colorizer");
const _get = require("lodash.get");
const _merge = require("lodash.merge");
const _set = require("lodash.set");
const _unset = require("lodash.unset");
class BasicLogging {
    // tslint:enable
    constructor(config) {
        // tslint:disable: object-literal-sort-keys
        this.config = {
            enabled: true,
            logging: undefined,
            request: false,
            maskValue: '[ Hidden ]',
            requestObjects: [],
            maskRequestObjects: [],
            excludeRequestObjects: [],
            response: false,
            maskResponseObjects: [],
            excludeResponseObjects: [],
            responseObjects: [],
            space: '   ',
            styling: true,
            colorizeSettings: {
                colors: {
                    STRING_KEY: 'white',
                    STRING_LITERAL: 'green',
                    NUMBER_LITERAL: 'yellow',
                    BRACE: 'white.bold',
                },
            },
        };
        // WIP: needs to be configurable
        this.routingLogger = (handleRequest) => {
            const route = `${chalk.bgWhite.black(' Route: ')} ${chalk(handleRequest.jovo.getRoute().path)}`;
            const type = `${chalk.bgWhite.black(' Type: ')} ${chalk(handleRequest.jovo.getRoute().type)}`;
            const state = `${chalk.bgWhite.black(' State: ')} ${chalk(handleRequest.jovo.getState() ? handleRequest.jovo.getState() : '-')}`;
        };
        this.requestLogger = (handleRequest) => {
            if (jovo_core_1.Logger.isLogLevel(jovo_core_1.LogLevel.VERBOSE)) {
                jovo_core_1.Log.verbose(jovo_core_1.Log.subheader(`Request JSON`, 'jovo-framework'));
                jovo_core_1.Log.yellow().verbose(JSON.stringify(handleRequest.host.getRequestObject(), null, this.config.space));
                return;
            }
            if (!this.config.request) {
                return;
            }
            const requestCopy = JSON.parse(JSON.stringify(handleRequest.host.getRequestObject()));
            if (this.config.maskRequestObjects && this.config.maskRequestObjects.length > 0) {
                this.config.maskRequestObjects.forEach((maskPath) => {
                    const value = _get(requestCopy, maskPath);
                    if (value) {
                        let newValue = this.config.maskValue;
                        if (typeof newValue === 'function') {
                            newValue = this.config.maskValue(value);
                        }
                        _set(requestCopy, maskPath, newValue);
                    }
                });
            }
            if (this.config.excludeRequestObjects && this.config.excludeRequestObjects.length > 0) {
                this.config.excludeRequestObjects.forEach((excludePath) => {
                    _unset(requestCopy, excludePath);
                });
            }
            // tslint:disable-next-line:no-console
            console.log();
            if (this.config.styling) {
                // tslint:disable-next-line:no-console
                console.log(chalk.bgWhite.black(' >>>>> Request - ' + new Date().toISOString() + ' '));
            }
            if (this.config.requestObjects && this.config.requestObjects.length > 0) {
                this.config.requestObjects.forEach((path) => {
                    // tslint:disable-next-line
                    console.log(JSON.stringify(_get(requestCopy, path), null, this.config.space));
                });
            }
            else {
                // tslint:disable-next-line
                console.log(this.style(JSON.stringify(requestCopy, null, this.config.space)));
                // tslint:disable-next-line:no-console
                console.log();
            }
        };
        this.responseLogger = (handleRequest) => {
            if (jovo_core_1.Logger.isLogLevel(jovo_core_1.LogLevel.VERBOSE)) {
                jovo_core_1.Log.verbose(jovo_core_1.Log.subheader(`Response JSON`, 'jovo-framework'));
                jovo_core_1.Log.yellow().verbose(JSON.stringify(handleRequest.jovo.$response, null, this.config.space));
                return;
            }
            if (!this.config.response) {
                return;
            }
            if (!handleRequest.jovo) {
                return;
            }
            const responseCopy = JSON.parse(JSON.stringify(handleRequest.jovo.$response));
            if (this.config.maskResponseObjects && this.config.maskResponseObjects.length > 0) {
                this.config.maskResponseObjects.forEach((maskPath) => {
                    const value = _get(responseCopy, maskPath);
                    if (value) {
                        let newValue = this.config.maskValue;
                        if (typeof newValue === 'function') {
                            newValue = this.config.maskValue(value);
                        }
                        _set(responseCopy, maskPath, newValue);
                    }
                });
            }
            if (this.config.excludeResponseObjects && this.config.excludeResponseObjects.length > 0) {
                this.config.excludeResponseObjects.forEach((excludePath) => {
                    _unset(responseCopy, excludePath);
                });
            }
            // tslint:disable-next-line:no-console
            console.log();
            if (this.config.styling) {
                // tslint:disable-next-line:no-console
                console.log(chalk.bgWhite.black(' <<<<< Response - ' + new Date().toISOString() + ' '));
            }
            if (this.config.responseObjects && this.config.responseObjects.length > 0) {
                this.config.responseObjects.forEach((path) => {
                    if (!handleRequest.jovo) {
                        return;
                    }
                    // tslint:disable-next-line
                    console.log(JSON.stringify(_get(responseCopy, path), null, this.config.space));
                });
            }
            else {
                // tslint:disable-next-line
                console.log(this.style(JSON.stringify(responseCopy, null, this.config.space)));
            }
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        // tslint:disable
        this.requestLogger = this.requestLogger.bind(this);
        this.routingLogger = this.routingLogger.bind(this);
        this.responseLogger = this.responseLogger.bind(this);
        // tslint:enable
    }
    install(app) {
        if (this.config.logging === true) {
            this.config.request = true;
            this.config.response = true;
        }
        else if (this.config.logging === false) {
            this.config.request = false;
            this.config.response = false;
        }
        app.on('request', this.requestLogger);
        app.on('after.router', this.routingLogger);
        app.on('after.response', this.responseLogger);
    }
    uninstall(app) {
        app.removeListener('request', this.requestLogger);
        app.removeListener('after.router', this.routingLogger);
        app.removeListener('after.response', this.responseLogger);
    }
    style(text) {
        if (this.config.styling) {
            text = colorize(text, this.config.colorizeSettings);
            // text = text.replace(/<speak>(.+?)<\/speak>/g, `<speak>\x1b[1m$1\x1b[0m\x1b[32m</speak>`);
            // text = text.replace(/"_JOVO_STATE_": "(.+?)"/g, `"_JOVO_STdsfATE_": "\x1b[33m$1\x1b[0m"`);
        }
        return text;
    }
}
exports.BasicLogging = BasicLogging;
//# sourceMappingURL=BasicLogging.js.map