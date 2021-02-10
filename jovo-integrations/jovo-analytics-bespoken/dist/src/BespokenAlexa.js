"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _merge = require("lodash.merge");
const uuid = require("uuid");
class BespokenAlexa {
    constructor(config) {
        this.config = {
            key: '',
        };
        if (config) {
            this.config = _merge(this.config, config);
        }
        this.track = this.track.bind(this);
    }
    install(app) {
        app.on('response', this.track);
    }
    uninstall(app) {
        app.removeListener('response', this.track);
    }
    track(handleRequest) {
        if (!handleRequest.jovo) {
            return;
        }
        if (handleRequest.jovo.constructor.name === 'AlexaSkill') {
            const payload = this.createBespokenLoglessObject([
                handleRequest.jovo.$request.toJSON(),
                handleRequest.jovo.$response,
            ]);
            this.sendDataToLogless(payload);
        }
    }
    /**
     * Wraps a request or response to be sent to Bespoken Logless Server
     * @param {Object} payloads Captured request and response
     * @return {object} The request or response ready to be send to logless
     */
    createBespokenLoglessObject(payloads) {
        const logs = payloads.map((payload, index) => {
            // we always send two logs,  0 = request, 1 = response.
            const tag = index ? 'response' : 'request';
            return {
                log_type: 'INFO',
                payload,
                tags: [tag],
                timestamp: new Date(),
            };
        });
        return {
            logs,
            source: this.config.key,
            transaction_id: uuid.v4(),
        };
    }
    // tslint:disable-next-line
    sendDataToLogless(payload) {
        const config = {
            data: payload,
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'POST',
            url: 'https://logless.bespoken.tools/v1/receive',
        };
        return jovo_core_1.HttpService.request(config).catch((e) => {
            jovo_core_1.Log.error('Error while logging to Bespoken Services');
            jovo_core_1.Log.error(e);
        });
    }
}
exports.BespokenAlexa = BespokenAlexa;
//# sourceMappingURL=BespokenAlexa.js.map