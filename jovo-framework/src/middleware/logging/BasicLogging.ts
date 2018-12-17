import {BaseApp, HandleRequest, Plugin, PluginConfig} from "jovo-core";
import _get = require('lodash.get');
import _merge = require('lodash.merge');


export interface Config extends PluginConfig {
    logging?: boolean;
    request?: boolean;
    response?: boolean;
    requestObjects?: string[];
    responseObjects?: string[];
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
        responseObjects: [],
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

        app.on('after.platform.init', this.requestLogger);
        app.on('response', this.responseLogger);
    }

    uninstall(app: BaseApp) {
        app.removeListener('after.platform.init', this.requestLogger);
        app.removeListener('response', this.responseLogger);
    }

    requestLogger = (handleRequest: HandleRequest) => {
        if (!this.config.request) {
            return;
        }
        if (!handleRequest.jovo) {
            return;
        }

        if (this.config.requestObjects && this.config.requestObjects.length > 0) {
            this.config.requestObjects.forEach((path: string) => {
                if (!handleRequest.jovo) {
                    return;
                }
                console.log(
                    JSON.stringify(
                        _get(handleRequest.jovo.$request, path), null, this.config.space));
            });
        } else {
            console.log(JSON.stringify(handleRequest.jovo.$request, null, this.config.space));
        }
    };

    responseLogger = (handleRequest: HandleRequest) => {
        if (!this.config.response) {
            return;
        }
        if (!handleRequest.jovo) {
            return;
        }
        if (this.config.responseObjects && this.config.responseObjects.length > 0) {
            this.config.responseObjects.forEach((path: string) => {
                if (!handleRequest.jovo) {
                    return;
                }
                console.log(
                    JSON.stringify(
                        _get(handleRequest.jovo.$response, path), null, this.config.space));
            });
        } else {
            console.log(this.style(JSON.stringify(handleRequest.jovo.$response, null, this.config.space)));
        }
    };


    style(text: string) {
        if (this.config.styling) {
            text = text.replace(/<speak>(.+?)<\/speak>/g, `<speak>\x1b[36m$1\x1b[0m</speak>`);
            text = text.replace( /"_JOVO_STATE_": "(.+?)"/g,`"_JOVO_STATE_": "\x1b[33m$1\x1b[0m"`);
        }
        return text;

    }
}
