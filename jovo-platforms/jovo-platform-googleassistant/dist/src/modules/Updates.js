"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const GoogleAction_1 = require("../core/GoogleAction");
const GoogleActionResponse_1 = require("../core/GoogleActionResponse");
class Updates {
    constructor(googleAction) {
        this.googleAction = googleAction;
    }
    askForRegisterUpdate(intent, frequency = 'DAILY') {
        this.googleAction.$output.GoogleAssistant = {
            AskForRegisterUpdate: {
                intent,
                frequency,
            },
        };
    }
    isRegisterUpdateOk() {
        return this.getRegisterUpdateStatus() === 'OK';
    }
    getRegisterUpdateStatus() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'REGISTER_UPDATE') {
                return argument.extension.status;
            }
        }
    }
    isRegisterUpdateCancelled() {
        return this.getRegisterUpdateStatus() === 'CANCELLED';
    }
    getConfigureUpdatesIntent() {
        for (const argument of _get(this.googleAction.$originalRequest || this.googleAction.$request, 'inputs[0]["arguments"]', [])) {
            if (argument.name === 'UPDATE_INTENT') {
                return argument.extension.status;
            }
        }
    }
}
exports.Updates = Updates;
class UpdatesPlugin {
    install(googleAssistant) {
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.$updates = undefined;
    }
    type(googleAction) {
        const intentName = _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent');
        if (intentName === 'actions.intent.REGISTER_UPDATE') {
            _set(googleAction.$type, 'type', 'ON_REGISTER_UPDATE');
        }
        if (intentName === 'actions.intent.CONFIGURE_UPDATES') {
            _set(googleAction.$type, 'type', 'ON_CONFIGURE_UPDATES');
        }
        googleAction.$updates = new Updates(googleAction);
    }
    output(googleAction) {
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new GoogleActionResponse_1.GoogleActionResponse();
        }
        const output = googleAction.$output;
        const askForRegisterUpdate = _get(output, 'GoogleAssistant.AskForRegisterUpdate');
        if (askForRegisterUpdate) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.REGISTER_UPDATE',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.RegisterUpdateValueSpec',
                    'intent': askForRegisterUpdate.intent,
                    'triggerContext': {
                        timeContext: {
                            frequency: askForRegisterUpdate.frequency,
                        },
                    },
                },
            });
            _set(googleAction.$originalResponse, 'inputPrompt', {
                initialPrompts: [
                    {
                        textToSpeech: 'PLACEHOLDER_FOR_REGISTER_UPDATE',
                    },
                ],
                noInputPrompts: [],
            });
        }
    }
    uninstall(googleAssistant) { }
}
exports.UpdatesPlugin = UpdatesPlugin;
//# sourceMappingURL=Updates.js.map