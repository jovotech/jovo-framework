"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const _merge = require("lodash.merge");
const jovo_core_1 = require("jovo-core");
const AlexaSkill_1 = require("../core/AlexaSkill");
class Apl {
    constructor(alexaSkill) {
        this.alexaSkill = alexaSkill;
        this.version = '1.1';
    }
    // tslint:disable-next-line
    addDocumentDirective(documentDirective) {
        const doc = {
            type: 'Alexa.Presentation.APL.RenderDocument',
            version: this.version,
        };
        _merge(doc, documentDirective);
        const directives = _get(this.alexaSkill.$output, 'Alexa.Apl', []);
        directives.push(doc);
        _set(this.alexaSkill.$output, 'Alexa.Apl', directives);
        return this;
    }
    // tslint:disable-next-line
    addCommands(token, commands) {
        const commandDirective = {
            type: 'Alexa.Presentation.APL.ExecuteCommands',
            token,
            commands,
        };
        const existingExecuteCommands = _get(this.alexaSkill.$output, 'Alexa.Apl', []).filter(
        // tslint:disable-next-line
        (directive) => {
            return (directive.type === commandDirective.type && directive.token === commandDirective.token);
        });
        if (existingExecuteCommands[0]) {
            existingExecuteCommands[0].commands = existingExecuteCommands[0].commands.concat(commands);
        }
        else {
            const directives = _get(this.alexaSkill.$output, 'Alexa.Apl', []);
            directives.push(commandDirective);
            _set(this.alexaSkill.$output, 'Alexa.Apl', directives);
        }
        return this;
    }
    setVersion(version) {
        this.version = version;
    }
    isUserEvent() {
        return _get(this.alexaSkill.$request, 'request.type') === 'Alexa.Presentation.APL.UserEvent';
    }
    getEventArguments() {
        return _get(this.alexaSkill.$request, 'request.arguments');
    }
}
exports.Apl = Apl;
class AplPlugin {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        /**
         * Adds apl directive
         * @deprecated Please use addAPLDirective()
         * @public
         * @param {*} directive
         * @return {AlexaSkill}
         */
        // tslint:disable-next-line
        AlexaSkill_1.AlexaSkill.prototype.addAplDirective = function (directive) {
            const directives = _get(this.$output, 'Alexa.Apl', []);
            directives.push(directive);
            _set(this.$output, 'Alexa.Apl', directives);
            return this;
        };
        /**
         * Adds apl directive
         * @public
         * @param {*} directive
         * @return {AlexaSkill}
         */
        // tslint:disable-next-line
        AlexaSkill_1.AlexaSkill.prototype.addAPLDirective = function (directive) {
            const directives = _get(this.$output, 'Alexa.Apl', []);
            directives.push(directive);
            _set(this.$output, 'Alexa.Apl', directives);
            return this;
        };
        /**
         * Adds apl directive
         * @deprecated Use $alexaSkill.$apl.addCommnds()
         * @public
         * @param {*} documentDirective
         * @return {AlexaSkill}
         */
        // tslint:disable-next-line
        AlexaSkill_1.AlexaSkill.prototype.addAPLDocument = function (documentDirective) {
            const document = {
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
            };
            _merge(document, documentDirective);
            const directives = _get(this.$output, 'Alexa.Apl', []);
            directives.push(document);
            _set(this.$output, 'Alexa.Apl', directives);
            return this;
        };
        /**
         * Adds apl directive
         * @public
         * @deprecated Use $alexaSkill.$apl.addCommnds()
         * @param {string} token
         * @param {*} commands
         * @return {AlexaSkill}
         */
        // tslint:disable-next-line
        AlexaSkill_1.AlexaSkill.prototype.addAPLCommands = function (token, commands) {
            const commandDirective = {
                type: 'Alexa.Presentation.APL.ExecuteCommands',
                token,
                commands,
            };
            const existingExecuteCommands = _get(this.$output, 'Alexa.Apl', []).filter(
            // tslint:disable-next-line
            (directive) => {
                return (directive.type === commandDirective.type && directive.token === commandDirective.token);
            });
            if (existingExecuteCommands[0]) {
                existingExecuteCommands[0].commands = existingExecuteCommands[0].commands.concat(commands);
            }
            else {
                const directives = _get(this.$output, 'Alexa.Apl', []);
                directives.push(commandDirective);
                _set(this.$output, 'Alexa.Apl', directives);
            }
            return this;
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type') === 'Alexa.Presentation.APL.UserEvent') {
            alexaSkill.$type = {
                type: jovo_core_1.EnumRequestType.ON_ELEMENT_SELECTED,
                subType: _get(alexaRequest, 'request.token'),
            };
        }
        alexaSkill.$apl = new Apl(alexaSkill);
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        const response = alexaSkill.$response;
        const request = alexaSkill.$request;
        const apl = _get(output, 'Alexa.Apl');
        if (apl) {
            const directives = _get(response, 'response.directives', []);
            if (Array.isArray(apl)) {
                // tslint:disable-next-line
                apl.forEach((directive) => {
                    if (request.hasAPLInterface() || isAplA(directive)) {
                        directives.push(directive);
                    }
                });
            }
            else {
                if (request.hasAPLInterface() || isAplA(apl)) {
                    directives.push(apl);
                }
            }
            _set(response, 'response.directives', directives);
        }
    }
}
exports.AplPlugin = AplPlugin;
// tslint:disable-next-line
function isAplA(directive) {
    return directive.type.startsWith('Alexa.Presentation.APLA');
}
//# sourceMappingURL=AplPlugin.js.map