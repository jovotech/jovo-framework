"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Extensible_1 = require("../core/Extensible");
class BaseCmsPlugin extends Extensible_1.Extensible {
    /**
     * Implemented install method
     * @param {BaseApp} app
     */
    install(app) {
        app.middleware('after.platform.init').use(this.copyCmsDataToContext.bind(this));
    }
    /**
     * Copies cms data from the app object to the jovo object.
     * @param {HandleRequest} handleRequest
     * @returns {Promise<void>}
     */
    async copyCmsDataToContext(handleRequest) {
        if (handleRequest.jovo) {
            handleRequest.jovo.$cms.$jovo = handleRequest.jovo;
            Object.assign(handleRequest.jovo.$cms, handleRequest.app.$cms);
        }
    }
}
exports.BaseCmsPlugin = BaseCmsPlugin;
//# sourceMappingURL=BaseCmsPlugin.js.map