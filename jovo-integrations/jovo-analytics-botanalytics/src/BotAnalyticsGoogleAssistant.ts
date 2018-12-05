import {Analytics, PluginConfig, BaseApp, HandleRequest} from "jovo-core";
import * as _ from 'lodash';

import {GoogleAssistant} from 'botanalytics';

export interface Config extends PluginConfig {
    key: string;
}


export class BotAnalyticsGoogleAssistant implements Analytics {
    config: Config = {
        key: '',
    };
    botanalytics!: GoogleAssistant;

    constructor(config?: Config) {
        if (config) {
            this.config = _.merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }

    install(app: BaseApp) {
        this.botanalytics = GoogleAssistant(this.config.key);
        app.on('response', this.track);
    }

    uninstall(app: BaseApp) {
        app.removeListener('response', this.track);
    }

    track(handleRequest: HandleRequest) {
        if (!handleRequest.jovo) {
            return;
        }

        this.botanalytics.log(
            handleRequest.host.getRequestObject(),
            handleRequest.jovo.$response!
        );
    }
}
