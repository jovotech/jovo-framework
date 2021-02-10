"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleAction_1 = require("../core/GoogleAction");
const google_assistant_enums_1 = require("../core/google-assistant-enums");
const __1 = require("..");
class NewSurface {
    install(googleAssistant) {
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.newSurface = function (capabilities, context, notificationTitle) {
            this.$output.GoogleAssistant = {
                NewSurface: {
                    capabilities,
                    context,
                    notificationTitle,
                },
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.isNewSurfaceConfirmed = function () {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'NEW_SURFACE') {
                    return _get(argument, 'extension.status') === 'OK';
                }
            }
            return false;
        };
    }
    uninstall(googleAssistant) { }
    type(googleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.NEW_SURFACE') {
            googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_NEW_SURFACE;
        }
    }
    output(googleAction) {
        const output = googleAction.$output;
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new __1.GoogleActionResponse();
        }
        if (_get(output, 'GoogleAssistant.NewSurface')) {
            const { capabilities, context, notificationTitle } = output.GoogleAssistant.NewSurface;
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.NEW_SURFACE',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.NewSurfaceValueSpec',
                    context,
                    capabilities,
                    notificationTitle,
                },
            });
        }
    }
}
exports.NewSurface = NewSurface;
//# sourceMappingURL=NewSurface.js.map