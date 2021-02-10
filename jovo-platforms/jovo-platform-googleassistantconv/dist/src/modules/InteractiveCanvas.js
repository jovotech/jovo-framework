"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleAction_1 = require("../core/GoogleAction");
class InteractiveCanvas {
    install(googleAssistant) {
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.htmlResponse = function (obj) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.htmlResponse = obj;
            return this;
        };
    }
    output(googleAction) {
        if (!googleAction.hasInteractiveCanvasInterface()) {
            return;
        }
        const output = googleAction.$output;
        const htmlResponse = _get(output, 'GoogleAssistant.htmlResponse');
        if (htmlResponse) {
            _set(googleAction.$response, 'prompt.canvas', htmlResponse);
        }
    }
    uninstall(googleAssistant) { }
}
exports.InteractiveCanvas = InteractiveCanvas;
//# sourceMappingURL=InteractiveCanvas.js.map