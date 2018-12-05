import { Analytics, PluginConfig, BaseApp, HandleRequest } from "jovo-core";
import * as _ from 'lodash';

import {AmazonAlexa} from 'botanalytics';

export interface Config extends PluginConfig {
    key: string;
}


export class BotAnalyticsAlexa implements Analytics {
    config: Config = {
        key: '',
    };
    botanalytics!: AmazonAlexa;

    constructor(config?: Config) {
        if (config) {
            this.config = _.merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }

    install(app: BaseApp) {
        this.botanalytics = new AmazonAlexa(this.config.key);
        app.on('response', this.track);
    }

    uninstall(app: BaseApp) {
        app.removeListener('response', this.track);
    }

    track(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            return;
        }

        if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
            this.botanalytics.log(
                handleRequest.host.getRequestObject(),
                handleRequest.jovo.$response!
            );
        }
    }
}
