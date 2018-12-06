import {Analytics, PluginConfig, BaseApp, HandleRequest} from "jovo-core";
import * as _ from 'lodash';
import * as uuid from 'uuid';
import * as https from 'https';

export interface Config extends PluginConfig {
    key: string;
}

export class BespokenAlexa implements Analytics {
    config: Config = {
        key: '',
    };

    constructor(config?: Config) {
        if (config) {
            this.config = _.merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }

    install(app: BaseApp) {
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
            const payload = this.createBespokenLoglessObject(
                [
                    handleRequest.jovo.$request!.toJSON(),
                    handleRequest.jovo.$response
                ]
            );
            this.sendDataToLogless(JSON.stringify(payload));
        }
    }

    /**
     * Wraps a request or response to be sent to Bespoken Logless Server
     * @param {Object} payloads Captured request and response
     * @return {object} The request or response ready to be send to logless
     */
    createBespokenLoglessObject(payloads: object[]) {
        const logs = payloads.map((payload, index) => {
            // we always send two logs,  0 = request, 1 = response.
            const tag = index ? 'response' : 'request';
            return {
                log_type: 'INFO',
                timestamp: new Date(),
                payload,
                tags: [tag],
            };
        });
        return {
            source: this.config.key,
            transaction_id: uuid.v4(),
            logs,
        };
    }

    sendDataToLogless(data: string) {
        const options = {
            host: 'logless.bespoken.tools',
            path: '/v1/receive',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
        };

        const httpRequest = https.request(options);

        httpRequest.on('error', (error) => {
            console.error('Error while logging to Bespoken Services', error);
        });

        httpRequest.end(data);
    }
}
