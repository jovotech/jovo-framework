import * as _ from "lodash";
import {BaseApp, HandleRequest, Plugin, PluginConfig} from "jovo-core";

export interface Config extends PluginConfig {
    logging?: boolean;
    requestLogging?: boolean;
    responseLogging?: boolean;
    requestLoggingObjects?: string[];
    responseLoggingObjects?: string[];
    space?: string;
    styling?: boolean;
}

export class BasicLogging implements Plugin {
    config: Config = {
        enabled: true,
        logging: false,
        requestLogging: false,
        responseLogging: false,
        requestLoggingObjects: [],
        responseLoggingObjects: [],
        space: '\t',
        styling: false,
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _.merge(this.config, config);
        }
        this.requestLogger = this.requestLogger.bind(this);
        this.responseLogger = this.responseLogger.bind(this);
    }
    install(app: BaseApp) {
        if (this.config.logging === true) {
            this.config.requestLogging = true;
            this.config.responseLogging = true;
        } else {
            this.config.requestLogging = false;
            this.config.responseLogging = false;
        }

        app.on('after.platform.init', this.requestLogger);
        app.on('response', this.responseLogger);
    }

    uninstall(app: BaseApp) {
        app.removeListener('after.platform.init', this.requestLogger);
        app.removeListener('response', this.responseLogger);
    }

    requestLogger = (handleRequest: HandleRequest) => {
        if (!this.config.requestLogging) {
            return;
        }
        if (!handleRequest.jovo) {
            return;
        }

        if (this.config.requestLoggingObjects && this.config.requestLoggingObjects.length > 0) {
            this.config.requestLoggingObjects.forEach((path: string) => {
                if (!handleRequest.jovo) {
                    return;
                }
                console.log(
                    JSON.stringify(
                        _.get(handleRequest.jovo.$request, path), null, this.config.space));
            });
        } else {
            console.log(JSON.stringify(handleRequest.jovo.$request, null, this.config.space));
        }
    };

    responseLogger = (handleRequest: HandleRequest) => {
        if (!this.config.responseLogging) {
            return;
        }
        if (!handleRequest.jovo) {
            return;
        }
        if (this.config.responseLoggingObjects && this.config.responseLoggingObjects.length > 0) {
            this.config.responseLoggingObjects.forEach((path) => {
                if (!handleRequest.jovo) {
                    return;
                }
                console.log(
                    JSON.stringify(
                        _.get(handleRequest.jovo.$response, path), null, this.config.space));
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
