"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const AlexaSkill_1 = require("../core/AlexaSkill");
const alexa_enums_1 = require("../core/alexa-enums");
const _set = require("lodash.set");
class AskFor {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        AlexaSkill_1.AlexaSkill.prototype.askForPermission = function (permissionScope, token) {
            _set(this.$output, 'Alexa.AskForPermission', {
                type: 'Connections.SendRequest',
                name: 'AskFor',
                payload: {
                    '@type': 'AskForPermissionsConsentRequest',
                    '@version': '1',
                    'permissionScope': permissionScope,
                },
                token: token || '',
            });
            return this;
        };
        AlexaSkill_1.AlexaSkill.prototype.askForReminders = function (token) {
            return this.askForPermission('alexa::alerts:reminders:skill:readwrite', token);
        };
        AlexaSkill_1.AlexaSkill.prototype.askForTimers = function (token) {
            return this.askForPermission('alexa::alerts:timers:skill:readwrite', token);
        };
        AlexaSkill_1.AlexaSkill.prototype.getPermissionStatus = function () {
            return _get(this.$request, 'request.payload.status');
        };
        AlexaSkill_1.AlexaSkill.prototype.hasPermissionAccepted = function () {
            return _get(this.$request, 'request.payload.status') === 'ACCEPTED';
        };
        AlexaSkill_1.AlexaSkill.prototype.hasPermissionDenied = function () {
            return _get(this.$request, 'request.payload.status') === 'DENIED';
        };
        AlexaSkill_1.AlexaSkill.prototype.hasPermissionNotAnswered = function () {
            return _get(this.$request, 'request.payload.status') === 'NOT_ANSWERED';
        };
        AlexaSkill_1.AlexaSkill.prototype.getPermissionIsCardThrown = function () {
            return _get(this.$request, 'request.payload.isCardThrown');
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        const responseNames = ['AskFor'];
        if (_get(alexaRequest, 'request.type') === 'Connections.Response' &&
            responseNames.includes(_get(alexaRequest, 'request.name'))) {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.ON_PERMISSION,
            };
        }
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        const response = alexaSkill.$response;
        if (output.Alexa && output.Alexa.AskForPermission) {
            const directives = _get(response, 'response.directives', []);
            directives.push(_get(output, 'Alexa.AskForPermission'));
            _set(response, 'response.directives', directives);
            if (typeof _get(response, 'response.shouldEndSession') !== 'undefined') {
                delete response.response.shouldEndSession;
            }
        }
    }
}
exports.AskFor = AskFor;
//# sourceMappingURL=AskFor.js.map