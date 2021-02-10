"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleAction_1 = require("../core/GoogleAction");
const google_assistant_enums_1 = require("../core/google-assistant-enums");
const GoogleActionResponse_1 = require("../core/GoogleActionResponse");
class AskFor {
    install(googleAssistant) {
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.askForName = function (optContext = '') {
            return this.askForNamePermission(optContext);
        };
        GoogleAction_1.GoogleAction.prototype.askForZipCodeAndCity = function (optContext = '') {
            return this.askForCoarseLocation(optContext);
        };
        GoogleAction_1.GoogleAction.prototype.askForNamePermission = function (optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions: ['NAME'],
                    optContext,
                },
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.askForCoarseLocation = function (optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions: ['DEVICE_COARSE_LOCATION'],
                    optContext,
                },
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.askForPreciseLocation = function (optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions: ['DEVICE_PRECISE_LOCATION'],
                    optContext,
                },
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.askForUpdate = function (intent) {
            return this.askForNotification(intent);
        };
        GoogleAction_1.GoogleAction.prototype.askForNotification = function (intent) {
            this.$output.GoogleAssistant = {
                AskForUpdatePermission: {
                    intent,
                },
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.askForPermission = function (permissions, optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions,
                    optContext,
                },
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.isPermissionGranted = function () {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'PERMISSION') {
                    return _get(argument, 'boolValue', false);
                }
            }
            return false;
        };
        GoogleAction_1.GoogleAction.prototype.askForSignIn = function (optContext = '') {
            this.$output.GoogleAssistant = {
                AskForSignIn: {
                    optContext,
                },
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.getSignInStatus = function () {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'SIGN_IN') {
                    return argument.extension.status;
                }
            }
        };
        GoogleAction_1.GoogleAction.prototype.isSignInCancelled = function () {
            return this.getSignInStatus() === 'CANCELLED';
        };
        GoogleAction_1.GoogleAction.prototype.isSignInDenied = function () {
            return this.getSignInStatus() === 'DENIED';
        };
        GoogleAction_1.GoogleAction.prototype.isSignInOk = function () {
            return this.getSignInStatus() === 'OK';
        };
        GoogleAction_1.GoogleAction.prototype.askForDateTime = function (questions) {
            this.$output.GoogleAssistant = {
                AskForDateTime: questions,
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.getDateTime = function () {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'DATETIME') {
                    return argument.datetimeValue;
                }
            }
        };
        GoogleAction_1.GoogleAction.prototype.getPlace = function () {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'PLACE') {
                    return argument.placeValue;
                }
            }
        };
        GoogleAction_1.GoogleAction.prototype.getDevice = function () {
            return _get(this.$originalRequest || this.$request, 'device');
        };
        GoogleAction_1.GoogleAction.prototype.askForConfirmation = function (text) {
            this.$output.GoogleAssistant = {
                AskForConfirmation: text,
            };
            return this;
        };
        GoogleAction_1.GoogleAction.prototype.isConfirmed = function () {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'CONFIRMATION') {
                    return argument.boolValue;
                }
            }
        };
        GoogleAction_1.GoogleAction.prototype.askForPlace = function (requestPrompt, permissionContext) {
            this.$output.GoogleAssistant = {
                AskForPlace: {
                    requestPrompt,
                    permissionContext,
                },
            };
            return this;
        };
    }
    uninstall(googleAssistant) { }
    type(googleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.PERMISSION') {
            googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PERMISSION;
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.SIGN_IN') {
            googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_SIGN_IN;
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.CONFIRMATION') {
            googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_CONFIRMATION;
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.DATETIME') {
            googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_DATETIME;
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.PLACE') {
            googleAction.$type.type = google_assistant_enums_1.EnumGoogleAssistantRequestType.ON_PLACE;
        }
    }
    output(googleAction) {
        const output = googleAction.$output;
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new GoogleActionResponse_1.GoogleActionResponse();
        }
        const askForSignIn = _get(output, 'card.AccountLinkingCard') || _get(output, 'GoogleAssistant.AskForSignIn');
        if (askForSignIn) {
            const optContext = _get(output, 'GoogleAssistant.AskForSignIn.optContext') ||
                _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.SIGN_IN',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
                    'optContext': optContext || '',
                },
            });
            _set(googleAction.$originalResponse, 'inputPrompt', {
                initialPrompts: [
                    {
                        textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
                    },
                ],
                noInputPrompts: [],
            });
        }
        if (_get(output, 'GoogleAssistant.AskForPermission')) {
            const optContext = _get(output, 'GoogleAssistant.AskForPermission.optContext') ||
                _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': optContext || '',
                    'permissions': _get(output, 'GoogleAssistant.AskForPermission.permissions'),
                },
            });
        }
        if (_get(output, 'GoogleAssistant.AskForUpdatePermission')) {
            const optContext = _get(output, 'GoogleAssistant.AskForPermission.optContext') ||
                _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'optContext': optContext || '',
                    'permissions': ['UPDATE'],
                    'updatePermissionValueSpec': {
                        intent: _get(output, 'GoogleAssistant.AskForUpdatePermission.intent'),
                    },
                },
            });
        }
        if (_get(output, 'GoogleAssistant.AskForDateTime')) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.DATETIME',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.DateTimeValueSpec',
                    'dialogSpec': _get(output, 'GoogleAssistant.AskForDateTime'),
                },
            });
        }
        if (_get(output, 'GoogleAssistant.AskForConfirmation')) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.CONFIRMATION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.ConfirmationValueSpec',
                    'dialogSpec': {
                        requestConfirmationText: _get(output, 'GoogleAssistant.AskForConfirmation'),
                    },
                },
            });
        }
        if (_get(output, 'GoogleAssistant.AskForPlace')) {
            _set(googleAction.$originalResponse, 'expectUserResponse', true);
            _set(googleAction.$originalResponse, 'systemIntent', {
                intent: 'actions.intent.PLACE',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PlaceValueSpec',
                    'dialog_spec': {
                        extension: {
                            '@type': 'type.googleapis.com/google.actions.v2.PlaceValueSpec.PlaceDialogSpec',
                            'requestPrompt': _get(output, 'GoogleAssistant.AskForPlace.requestPrompt'),
                            'permissionContext': _get(output, 'GoogleAssistant.AskForPlace.permissionContext'),
                        },
                    },
                },
            });
        }
    }
}
exports.AskFor = AskFor;
//# sourceMappingURL=AskFor.js.map