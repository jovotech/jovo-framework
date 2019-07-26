import _get = require('lodash.get');
import _set = require('lodash.set');
import _merge = require('lodash.merge');
import _sample = require('lodash.sample');

import {EnumRequestType, Plugin} from 'jovo-core';
import {AlexaSkill} from "../core/AlexaSkill";
import {AlexaRequest} from "../core/AlexaRequest";
import {Alexa} from "../Alexa";
import {Template} from "../response/visuals/Template";
import {AlexaResponse} from "../core/AlexaResponse";


export class Display implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$type')!.use(this.type.bind(this));
        alexa.middleware('$output')!.use(this.output.bind(this));


        /**
         * Shows template on Echo Show
         * @public
         * @param {*} template
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.showDisplayTemplate = function(template: Template) {
            _set(this.$output, 'Alexa.DisplayTemplate',
                new DisplayRenderTemplateDirective(template)
            );
            return this;
        };


        /**
         * Shows hint on Echo Show
         * @public
         * @param {*} text
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.showHint = function(text: string | string[]) {
            _set(this.$output, 'Alexa.DisplayHint',
                new DisplayHintDirective(Array.isArray(text) ? _sample(text)! : text)
            );
            return this;
        };


        /**
         * Adds apl directive
         * @deprecated Please use addAPLDirective()
         * @public
         * @param {*} directive
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.addAplDirective = function(directive: any) { // tslint:disable-line
            const directives = _get(this.$output, 'Alexa.Apl', []);
            directives.push(directive);
            _set(this.$output, 'Alexa.Apl',directives);

            return this;
        };

        /**
         * Adds apl directive
         * @public
         * @param {*} directive
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.addAPLDirective = function(directive: any) { // tslint:disable-line
            const directives = _get(this.$output, 'Alexa.Apl', []);
            directives.push(directive);
            _set(this.$output, 'Alexa.Apl',directives);

            return this;
        };

        /**
         * Adds apl directive
         * @public
         * @param {*} documentDirective
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.addAPLDocument = function(documentDirective: any) { // tslint:disable-line
            const document = {
                type: 'Alexa.Presentation.APL.RenderDocument',
                version: '1.0',
            };
            _merge(document, documentDirective);

            const directives = _get(this.$output, 'Alexa.Apl', []);
            directives.push(document);
            _set(this.$output, 'Alexa.Apl',directives);

            return this;
        };

        /**
         * Adds apl directive
         * @public
         * @param {string} token
         * @param {*} commands
         * @return {AlexaSkill}
         */
        AlexaSkill.prototype.addAPLCommands = function(token: string, commands: any[]) { // tslint:disable-line
            const commandDirective = {
                type: 'Alexa.Presentation.APL.ExecuteCommands',
                token,
                commands,
            };

            const existingExecuteCommands = _get(this.$output, 'Alexa.Apl', []).filter((directive: any) => { // tslint:disable-line
                return directive.type === commandDirective.type && directive.token === commandDirective.token;
            });

            if (existingExecuteCommands[0]) {
                existingExecuteCommands[0].commands = existingExecuteCommands[0].commands.concat(commands);
            } else {
                const directives = _get(this.$output, 'Alexa.Apl', []);
                directives.push(commandDirective);
                _set(this.$output, 'Alexa.Apl',directives);
            }

            return this;
        };

        /**
         * Shows video on Echo Show
         * @public
         * @param {string} url
         * @param {string} title
         * @param {string} subtitle
         */
        AlexaSkill.prototype.showVideo = function(url: string, title?: string, subtitle?: string) {
            _set(this.$output, 'Alexa.VideoApp',
                (new VideoAppLaunchDirective()).setData(url, title, subtitle)
            );
            return this;
        };

    }
    uninstall(alexa: Alexa) {

    }
    type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (_get(alexaRequest, 'request.type') === 'Display.ElementSelected' ||
        _get(alexaRequest, 'request.type') === 'Alexa.Presentation.APL.UserEvent') {
            alexaSkill.$type = {
                type: EnumRequestType.ON_ELEMENT_SELECTED,
                subType: _get(alexaRequest, 'request.token')
            };
        }
    }
    output(alexaSkill: AlexaSkill) {
        const output = alexaSkill.$output;
        const response = alexaSkill.$response as AlexaResponse;

        if (alexaSkill.$request!.hasScreenInterface()) {

            if (_get(output, 'Alexa.DisplayTemplate')) {
                const directives = _get(alexaSkill.$response, 'response.directives', []);
                directives.push(_get(output, 'Alexa.DisplayTemplate'));
                _set(response, 'response.directives', directives);
            }

            if (_get(output, 'Alexa.DisplayHint')) {
                const directives = _get(alexaSkill.$response, 'response.directives', []);
                directives.push(_get(output, 'Alexa.DisplayHint'));
                _set(response, 'response.directives', directives);
            }

            if (_get(output, 'Alexa.VideoApp')) {
                const directives = _get(alexaSkill.$response, 'response.directives', []);
                directives.push(_get(output, 'Alexa.VideoApp'));
                _set(response, 'response.directives', directives);

                if (_get(response, 'response.shouldEndSession')) {
                    delete response.response.shouldEndSession;
                }

                // set sessionAttributes (necessary since AlexaCore's handler runs before us
                // and skips adding session attributes due to shouldEndSession being true at that point)
                if (alexaSkill.$session && alexaSkill.$session.$data) {
                    _set(response, 'sessionAttributes', alexaSkill.$session.$data);
                }
            }
        }

        if ((alexaSkill.$request! as AlexaRequest).hasAPLInterface()) {
            if (_get(output, 'Alexa.Apl')) {
                let directives = _get(response, 'response.directives', []);

                if (Array.isArray(_get(output, 'Alexa.Apl'))) {
                    directives = directives.concat(_get(output, 'Alexa.Apl'));
                } else {
                    directives.push(_get(output, 'Alexa.Apl'));
                }
                _set(response, 'response.directives', directives);
            }
        }

        if (_get(output, 'Alexa.deleteShouldEndSession')) {
            if (_get(response, 'response.shouldEndSession')) {
                delete response.response.shouldEndSession;
            }
        }
    }
}


abstract class DisplayDirective {
    type: string;

    constructor(type: string) {
        this.type = type;
    }
}

class DisplayRenderTemplateDirective extends DisplayDirective {
    template?: Template;
    constructor(template?: Template) {
        super('Display.RenderTemplate');
        this.template = template;
    }

    setTemplate(template: Template) {
        this.template = template;
        return this;
    }
}

class DisplayHintDirective extends DisplayDirective {
    hint?: {
        type: string;
        text: string;
    };

    constructor(text?: string) {
        super('Hint');
        if (text) {
            this.setHint(text);
        }
    }

    setHint(text: string) {
        this.hint = {
            type: 'PlainText',
            text,
        };
        return this;
    }
}

interface VideoItem {
    source: string;
    metadata?: {
        title?: string;
        subtitle?: string;
    };
}

class VideoAppLaunchDirective extends DisplayDirective {
    videoItem?: VideoItem;
    constructor() {
        super('VideoApp.Launch');
    }

    setVideoItem(videoItem: VideoItem) {
        this.videoItem = videoItem;
    }

    setData(url: string, title?: string, subtitle?: string ) {
        this.videoItem = {
            source: url,
        };
        if (title) {
            this.videoItem.metadata = {
                title
            };

            if (subtitle) {
                this.videoItem.metadata.subtitle = subtitle;
            }

        }
        return this;
    }

}
