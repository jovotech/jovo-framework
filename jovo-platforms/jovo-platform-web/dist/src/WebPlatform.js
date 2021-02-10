"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const jovo_platform_core_1 = require("jovo-platform-core");
const _merge = require("lodash.merge");
const WebApp_1 = require("./core/WebApp");
const WebPlatformRequestBuilder_1 = require("./core/WebPlatformRequestBuilder");
const WebPlatformResponseBuilder_1 = require("./core/WebPlatformResponseBuilder");
const WebPlatformCore_1 = require("./modules/WebPlatformCore");
class WebPlatform extends jovo_platform_core_1.CorePlatform {
    constructor(config) {
        super(config);
        if (config) {
            this.config = _merge(this.config, config);
        }
    }
    install(app) {
        super.install(app);
        this.remove('CorePlatformCore');
        this.use(new WebPlatformCore_1.WebPlatformCore());
    }
    getAppType() {
        return 'WebApp';
    }
    get appClass() {
        return WebApp_1.WebApp;
    }
    augmentJovoPrototype() {
        jovo_core_1.Jovo.prototype.$webApp = undefined;
        jovo_core_1.Jovo.prototype.webApp = function () {
            if (this.constructor.name !== 'WebApp') {
                throw Error(`Can't handle request. Please use this.isWebApp()`);
            }
            return this;
        };
        jovo_core_1.Jovo.prototype.isWebApp = function () {
            return this.constructor.name === 'WebApp';
        };
    }
    getRequestBuilder() {
        return new WebPlatformRequestBuilder_1.WebPlatformRequestBuilder();
    }
    getResponseBuilder() {
        return new WebPlatformResponseBuilder_1.WebPlatformResponseBuilder();
    }
}
exports.WebPlatform = WebPlatform;
//# sourceMappingURL=WebPlatform.js.map