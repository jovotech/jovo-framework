import { Analytics, PluginConfig, BaseApp, HandleRequest } from "jovo-core";
import _merge = require('lodash.merge');
import dashbot, {Google} from 'dashbot';

export interface Config extends PluginConfig {
    key: string;
}

export class DashbotGoogleAssistant implements Analytics {
    config: Config = {
        key: '',
    };
    dashbot!: Google;

    constructor(config?: Config) {
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }

    install(app: BaseApp) {
        this.dashbot = dashbot(this.config.key).google;
        app.on('response', this.track);
    }

    uninstall(app: BaseApp) {
        app.removeListener('response', this.track);
    }

    track(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            return;
        }

        if (handleRequest.jovo.constructor.name === 'GoogleAction') {
            this.dashbot.logIncoming(handleRequest.host.getRequestObject());
            this.dashbot.logOutgoing(handleRequest.host.getRequestObject(), handleRequest.jovo.$response!);
        }
    }
}
