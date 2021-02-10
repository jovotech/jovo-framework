"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleAction_1 = require("../core/GoogleAction");
const GoogleActionResponse_1 = require("../core/GoogleActionResponse");
class InteractiveCanvas {
    install(googleAssistant) {
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.htmlResponse = function (obj) {
            if (!this.$output.GoogleAssistant) {
                this.$output.GoogleAssistant = {};
            }
            this.$output.GoogleAssistant.HtmlResponse = obj;
            return this;
        };
    }
    output(googleAction) {
        if (!googleAction.hasInteractiveCanvasInterface()) {
            return;
        }
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new GoogleActionResponse_1.GoogleActionResponse();
        }
        const output = googleAction.$output;
        const htmlResponse = _get(output, 'GoogleAssistant.HtmlResponse');
        if (htmlResponse) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
            richResponseItems.push({
                htmlResponse: {
                    url: htmlResponse.url,
                    updatedState: htmlResponse.data,
                    suppressMic: htmlResponse.suppress,
                },
            });
            _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
        }
    }
    uninstall(googleAssistant) { }
}
exports.InteractiveCanvas = InteractiveCanvas;
//# sourceMappingURL=InteractiveCanvas.js.map