"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HandleRequest {
    constructor(app, host, jovo) {
        this.app = app;
        this.host = host;
        this.jovo = jovo;
    }
    stopMiddlewareExecution() {
        this.excludedMiddlewareNames = [
            'setup',
            'request',
            'platform.init',
            'asr',
            'platform.nlu',
            'nlu',
            'user.load',
            'router',
            'handler',
            'user.save',
            'tts',
            'platform.output',
            'response',
            'fail',
        ];
    }
}
exports.HandleRequest = HandleRequest;
//# sourceMappingURL=HandleRequest.js.map