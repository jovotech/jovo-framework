"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_platform_core_1 = require("jovo-platform-core");
const WebAppResponse_1 = require("./WebAppResponse");
const WebAppSpeechBuilder_1 = require("./WebAppSpeechBuilder");
class WebApp extends jovo_platform_core_1.CorePlatformApp {
    constructor(app, host, handleRequest) {
        super(app, host, handleRequest);
        this.$corePlatformApp = undefined;
        this.$webApp = this;
        this.$response = new WebAppResponse_1.WebAppResponse();
        this.$speech = new WebAppSpeechBuilder_1.WebAppSpeechBuilder(this);
        this.$reprompt = new WebAppSpeechBuilder_1.WebAppSpeechBuilder(this);
    }
    getType() {
        return 'WebApp';
    }
    getPlatformType() {
        return 'WebPlatform';
    }
    speechBuilder() {
        return this.getSpeechBuilder();
    }
    getSpeechBuilder() {
        return new WebAppSpeechBuilder_1.WebAppSpeechBuilder(this);
    }
}
exports.WebApp = WebApp;
//# sourceMappingURL=WebApp.js.map