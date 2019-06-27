import {BaseApp, HandleRequest, Log, Logger, LogLevel, Plugin, PluginConfig} from 'jovo-core';
import {request} from 'express';
import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');


export interface Config extends PluginConfig {
    logging?: boolean;
    request?: boolean;
    response?: boolean;
    requestObjects?: string[];
    excludedRequestObjects?: string[];
    responseObjects?: string[];
    excludedResponseObjects?: string[];
    excludeReplaceValue?: string;
    space?: string;
    styling?: boolean;
}

export class BasicLogging implements Plugin {
    config: Config = {
        enabled: true,
        logging: undefined,
        request: false,
        response: false,
        requestObjects: [],
        excludedRequestObjects: [],
        responseObjects: [],
        excludedResponseObjects: [],
        excludeReplaceValue: undefined,
        space: '\t',
        styling: false,
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }

        this.requestLogger = this.requestLogger.bind(this);
        this.responseLogger = this.responseLogger.bind(this);
    }

    install(app: BaseApp) {
        if (this.config.logging === true) {
            this.config.request = true;
            this.config.response = true;
        } else if (this.config.logging === false) {
            this.config.request = false;
            this.config.response = false;
        }

        app.on('request', this.requestLogger);
        app.on('after.response', this.responseLogger);
    }

    uninstall(app: BaseApp) {
        app.removeListener('request', this.requestLogger);
        app.removeListener('after.response', this.responseLogger);
    }

    requestLogger = (handleRequest: HandleRequest) => {
        if (Logger.isLogLevel(LogLevel.VERBOSE)) {
            Log.verbose(Log.subheader(`Request JSON`, 'jovo-framework'));
            Log.yellow().verbose(JSON.stringify(handleRequest.host.getRequestObject(), null, this.config.space));
            return;
        }

        if (!this.config.request) {
            return;
        }

        const requestCopy = Object.assign({}, handleRequest.host.getRequestObject());

        if (this.config.excludedRequestObjects && this.config.excludedRequestObjects.length > 0) {
            this.config.excludedRequestObjects.forEach((excludePath: string) => {
                if (_get(requestCopy, excludePath)) {
                    _set(requestCopy, excludePath, this.config.excludeReplaceValue);
                }
            });
        }

        if (this.config.requestObjects && this.config.requestObjects.length > 0) {
            this.config.requestObjects.forEach((path: string) => {
                console.log(
                    JSON.stringify(
                        _get(requestCopy, path), null, this.config.space));

            });
        } else {
            console.log(JSON.stringify(requestCopy, null, this.config.space));
        }

    };

    responseLogger = (handleRequest: HandleRequest) => {

        if (Logger.isLogLevel(LogLevel.VERBOSE)) {
            Log.verbose(Log.subheader(`Response JSON`, 'jovo-framework'));
            Log.yellow().verbose(JSON.stringify(handleRequest.jovo!.$response, null, this.config.space));
            return;
        }

        if (!this.config.response) {
            return;
        }
        if (!handleRequest.jovo) {
            return;
        }

        const responseCopy = Object.assign({}, handleRequest.jovo.$response);

        if (this.config.excludedResponseObjects && this.config.excludedResponseObjects.length > 0) {
            this.config.excludedResponseObjects.forEach((excludePath: string) => {
                if (_get(responseCopy, excludePath)) {
                    _set(responseCopy, excludePath, this.config.excludeReplaceValue);
                }
            });
        }

        if (this.config.responseObjects && this.config.responseObjects.length > 0) {
            this.config.responseObjects.forEach((path: string) => {
                if (!handleRequest.jovo) {
                    return;
                }
                console.log(
                    JSON.stringify(
                        _get(responseCopy, path), null, this.config.space));
            });
        } else {
            console.log(this.style(JSON.stringify(responseCopy, null, this.config.space)));
        }

    };


    style(text: string) {
        if (this.config.styling) {
            text = text.replace(/<speak>(.+?)<\/speak>/g, `<speak>\x1b[36m$1\x1b[0m</speak>`);
            text = text.replace(/"_JOVO_STATE_": "(.+?)"/g, `"_JOVO_STATE_": "\x1b[33m$1\x1b[0m"`);
        }
        return text;

    }
}
