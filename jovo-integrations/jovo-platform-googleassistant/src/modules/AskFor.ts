import {Plugin} from "jovo-core";
import _set = require('lodash.set');
import _get = require('lodash.get');

import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";
export interface Device {
    location: {
        coordinates: {
            latitude: string;
            longitude: string;
        };
    };
}


export class AskFor implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$type')!.use(this.type.bind(this));
        googleAssistant.middleware('$output')!.use(this.output.bind(this));

        GoogleAction.prototype.askForName = function(optContext = '') {
            return this.askForNamePermission(optContext);
        };
        GoogleAction.prototype.askForZipCodeAndCity = function(optContext = '') {
            return this.askForCoarseLocation(optContext);
        };
        GoogleAction.prototype.askForNamePermission = function(optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions: ['NAME'],
                    optContext
                }
            };
            return this;
        };

        GoogleAction.prototype.askForCoarseLocation = function(optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions: ['DEVICE_COARSE_LOCATION'],
                    optContext
                }
            };
            return this;
        };

        GoogleAction.prototype.askForPreciseLocation = function(optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions: ['DEVICE_PRECISE_LOCATION'],
                    optContext
                }
            };
            return this;
        };

        GoogleAction.prototype.askForUpdate = function(intent: string, optContext = '') {
            this.$output.GoogleAssistant = {
                AskForUpdatePermission: {
                    intent,
                    optContext
                }
            };
            return this;
        };

        GoogleAction.prototype.askForPermission = function(permissions: string[], optContext = '') {
            this.$output.GoogleAssistant = {
                AskForPermission: {
                    permissions,
                    optContext
                }
            };
            return this;
        };

        GoogleAction.prototype.isPermissionGranted = function() {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'PERMISSION') {
                    return _get(argument, 'boolValue', false);
                }
            }
            return false;
        };

        GoogleAction.prototype.askForSignIn = function(optContext = '') {
            this.$output.GoogleAssistant = {
                AskForSignIn: {
                    optContext
                }
            };
            return this;
        };

        GoogleAction.prototype.getSignInStatus = function() {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'SIGN_IN') {
                    return argument.extension.status;
                }
            }
        };

        GoogleAction.prototype.isSignInCancelled = function() {
            return this.getSignInStatus() === 'CANCELLED';
        };

        GoogleAction.prototype.isSignInDenied = function() {
            return this.getSignInStatus() === 'DENIED';
        };

        GoogleAction.prototype.isSignInOk = function() {
            return this.getSignInStatus() === 'DENIED';
        };

        GoogleAction.prototype.askForDateTime = function(questions: {
            requestDatetimeText: string;
            requestDateText: string
            requestTimeText: string
        }) {
            this.$output.GoogleAssistant = {
                AskForDateTime: questions
            };
            return this;
        };

        GoogleAction.prototype.getDateTime = function() {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'DATETIME') {
                    return argument.datetimeValue;
                }
            }
        };

        GoogleAction.prototype.getDevice = function(): Device {
            return _get(this.$originalRequest || this.$request, 'device');
        };

        GoogleAction.prototype.askForConfirmation = function(text: string) {
            this.$output.GoogleAssistant = {
                AskForConfirmation: text
            };
            return this;
        };

        GoogleAction.prototype.isConfirmed = function() {
            for (const argument of _get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'CONFIRMATION') {
                    return argument.boolValue;
                }
            }
        };

        GoogleAction.prototype.askForPlace = function(requestPrompt: string, permissionContext: string) {
            this.$output.GoogleAssistant = {
                AskForPlace: {
                    requestPrompt,
                    permissionContext,
                }
            };
            return this;
        };
    }
    uninstall(googleAssistant: GoogleAssistant) {

    }
    type(googleAction: GoogleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.PERMISSION') {
            _set(googleAction.$type, 'type', 'ON_PERMISSION'); // TODO: constant
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.SIGN_IN') {
            _set(googleAction.$type, 'type', 'ON_SIGN_IN');
        }
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.CONFIRMATION') {
            _set(googleAction.$type, 'type', 'ON_CONFIRMATION');
        }
    }
    output(googleAction: GoogleAction) {

        const output = googleAction.$output;
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }

        const askForSignIn = _get(output, 'card.AccountLinkingCard') ||
            _get(output, 'GoogleAssistant.AskForSignIn');

        if (askForSignIn) {

            const optContext = _get(output, 'GoogleAssistant.AskForSignIn.optContext') ||
                _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));

            _set(googleAction.$response, 'expectUserResponse', true);

            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.SIGN_IN',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
                    optContext: optContext || '',
                }
            });
            _set(googleAction.$response, 'inputPrompt', {
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

            _set(googleAction.$response, 'expectUserResponse', true);

            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    optContext: optContext || '',
                    permissions: _get(output, 'GoogleAssistant.AskForPermission.permissions')
                }
            });
        }

        if (_get(output, 'GoogleAssistant.AskForUpdatePermission')) {
            const optContext = _get(output, 'GoogleAssistant.AskForUpdatePermission.optContext') ||
                _get(output, 'ask.speech', _get(output, 'GoogleAssistant.ask.speech'));

            _set(googleAction.$response, 'expectUserResponse', true);

            //TODO: doesn't work
            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.PERMISSION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'updatePermissionValueSpec': {
                        'intent': _get(output, 'GoogleAssistant.AskForUpdatePermission.intent'),
                    },
                    permissions: ['UPDATE']
                }
            });
        }

        if (_get(output, 'GoogleAssistant.AskForDateTime')) {
            _set(googleAction.$response, 'expectUserResponse', true);
            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.DATETIME',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.DateTimeValueSpec',
                    dialogSpec: _get(output, 'GoogleAssistant.AskForDateTime')
                }
            });
        }


        if (_get(output, 'GoogleAssistant.AskForConfirmation')) {
            _set(googleAction.$response, 'expectUserResponse', true);
            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.CONFIRMATION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.ConfirmationValueSpec',
                    dialogSpec: {
                        requestConfirmationText: _get(output, 'GoogleAssistant.AskForConfirmation')
                    }
                }
            });
        }

        if (_get(output, 'GoogleAssistant.AskForPlace')) {
            _set(googleAction.$response, 'expectUserResponse', true);
            _set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.PLACE',
                inputValueData: {
                    "@type": "type.googleapis.com/google.actions.v2.PlaceValueSpec",
                    dialog_spec: {
                        extension: {
                            "@type": "type.googleapis.com/google.actions.v2.PlaceValueSpec.PlaceDialogSpec",
                            requestPrompt: _get(output, 'GoogleAssistant.AskForPlace.requestPrompt'),
                            permissionContext: _get(output, 'GoogleAssistant.AskForPlace.requestPrompt')
                        }
                    }
                }
            });
        }
    }

}
