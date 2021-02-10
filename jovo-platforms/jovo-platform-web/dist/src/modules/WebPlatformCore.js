"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_platform_core_1 = require("jovo-platform-core");
const __1 = require("..");
class WebPlatformCore extends jovo_platform_core_1.CorePlatformCore {
    async init(handleRequest) {
        const requestObject = handleRequest.host.getRequestObject();
        if (this.isCoreRequest(requestObject) && requestObject.type === 'jovo-platform-web') {
            handleRequest.jovo = new __1.WebApp(handleRequest.app, handleRequest.host, handleRequest);
        }
    }
    async request(webApp) {
        if (!webApp.$host) {
            throw new Error(`Couldn't access host object.`);
        }
        this.overwriteRequestAudioData(webApp.$host);
        webApp.$request = __1.WebAppRequest.fromJSON(webApp.$host.getRequestObject());
        webApp.$user = new __1.WebAppUser(webApp);
    }
    getPlatformType() {
        return 'WebPlatform';
    }
}
exports.WebPlatformCore = WebPlatformCore;
//# sourceMappingURL=WebPlatformCore.js.map