import {Plugin, SpeechBuilder} from "jovo-core";
import * as _ from "lodash";
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
            for (const argument of _.get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'PERMISSION') {
                    return _.get(argument, 'boolValue', false);
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
            for (const argument of _.get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
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
            for (const argument of _.get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'DATETIME') {
                    return argument.datetimeValue;
                }
            }
        };

        GoogleAction.prototype.getDevice = function(): Device {
            return _.get(this.$originalRequest || this.$request, 'device');
        };

        GoogleAction.prototype.askForConfirmation = function(text: string) {
            this.$output.GoogleAssistant = {
                AskForConfirmation: text
            };
            return this;
        };

        GoogleAction.prototype.isConfirmed = function() {
            for (const argument of _.get(this.$originalRequest || this.$request, 'inputs[0]["arguments"]', [])) {
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
        if (_.get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.PERMISSION') {
            _.set(googleAction.$type, 'type', 'ON_PERMISSION'); // TODO: constant
        }
        if (_.get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.SIGN_IN') {
            _.set(googleAction.$type, 'type', 'ON_SIGN_IN');
        }
        if (_.get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.CONFIRMATION') {
            _.set(googleAction.$type, 'type', 'ON_CONFIRMATION');
        }
    }
    output(googleAction: GoogleAction) {

        const output = googleAction.$output;
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }

        const askForSignIn = _.get(output, 'card.AccountLinkingCard') ||
            _.get(output, 'GoogleAssistant.AskForSignIn');

        if (askForSignIn) {

            const optContext = _.get(output, 'GoogleAssistant.AskForSignIn.optContext') ||
                _.get(output, 'ask.speech', _.get(output, 'GoogleAssistant.ask.speech'));

            _.set(googleAction.$response, 'expectUserResponse', true);

            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.SIGN_IN',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.SignInValueSpec',
                    optContext: optContext || '',
                }
            });
            _.set(googleAction.$response, 'inputPrompt', {
                initialPrompts: [
                    {
                        textToSpeech: 'PLACEHOLDER_FOR_SIGN_IN',
                    },
                ],
                noInputPrompts: [],
            });
        }

        if (_.get(output, 'GoogleAssistant.AskForPermission')) {
            const optContext = _.get(output, 'GoogleAssistant.AskForPermission.optContext') ||
                _.get(output, 'ask.speech', _.get(output, 'GoogleAssistant.ask.speech'));

            _.set(googleAction.$response, 'expectUserResponse', true);

            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.PERMISSION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    optContext: optContext || '',
                    permissions: _.get(output, 'GoogleAssistant.AskForPermission.permissions')
                }
            });
        }

        if (_.get(output, 'GoogleAssistant.AskForUpdatePermission')) {
            const optContext = _.get(output, 'GoogleAssistant.AskForUpdatePermission.optContext') ||
                _.get(output, 'ask.speech', _.get(output, 'GoogleAssistant.ask.speech'));

            _.set(googleAction.$response, 'expectUserResponse', true);

            //TODO: doesn't work
            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.PERMISSION',
                data: {
                    '@type': 'type.googleapis.com/google.actions.v2.PermissionValueSpec',
                    'updatePermissionValueSpec': {
                        'intent': _.get(output, 'GoogleAssistant.AskForUpdatePermission.intent'),
                    },
                    permissions: ['UPDATE']
                }
            });
        }

        if (_.get(output, 'GoogleAssistant.AskForDateTime')) {
            _.set(googleAction.$response, 'expectUserResponse', true);
            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.DATETIME',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.DateTimeValueSpec',
                    dialogSpec: _.get(output, 'GoogleAssistant.AskForDateTime')
                }
            });
        }


        if (_.get(output, 'GoogleAssistant.AskForConfirmation')) {
            _.set(googleAction.$response, 'expectUserResponse', true);
            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.CONFIRMATION',
                inputValueData: {
                    '@type': 'type.googleapis.com/google.actions.v2.ConfirmationValueSpec',
                    dialogSpec: {
                        requestConfirmationText: _.get(output, 'GoogleAssistant.AskForConfirmation')
                    }
                }
            });
        }

        if (_.get(output, 'GoogleAssistant.AskForPlace')) {
            _.set(googleAction.$response, 'expectUserResponse', true);
            _.set(googleAction.$response, 'systemIntent', {
                intent: 'actions.intent.PLACE',
                inputValueData: {
                    "@type": "type.googleapis.com/google.actions.v2.PlaceValueSpec",
                    dialog_spec: {
                        extension: {
                            "@type": "type.googleapis.com/google.actions.v2.PlaceValueSpec.PlaceDialogSpec",
                            requestPrompt: _.get(output, 'GoogleAssistant.AskForPlace.requestPrompt'),
                            permissionContext: _.get(output, 'GoogleAssistant.AskForPlace.requestPrompt')
                        }
                    }
                }
            });
        }
    }

}
