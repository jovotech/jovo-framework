"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const _set = require("lodash.set");
const _sample = require("lodash.sample");
const jovo_core_1 = require("jovo-core");
const AlexaSkill_1 = require("../core/AlexaSkill");
class Display {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
        alexa.middleware('$output').use(this.output.bind(this));
        /**
         * Shows template on Echo Show
         * @public
         * @param {*} template
         * @return {AlexaSkill}
         */
        AlexaSkill_1.AlexaSkill.prototype.showDisplayTemplate = function (template) {
            _set(this.$output, 'Alexa.DisplayTemplate', new DisplayRenderTemplateDirective(template));
            return this;
        };
        /**
         * Shows hint on Echo Show
         * @public
         * @param {*} text
         * @return {AlexaSkill}
         */
        AlexaSkill_1.AlexaSkill.prototype.showHint = function (text) {
            _set(this.$output, 'Alexa.DisplayHint', new DisplayHintDirective(Array.isArray(text) ? _sample(text) : text));
            return this;
        };
        /**
         * Shows video on Echo Show
         * @public
         * @param {string} url
         * @param {string} title
         * @param {string} subtitle
         */
        AlexaSkill_1.AlexaSkill.prototype.showVideo = function (url, title, subtitle) {
            _set(this.$output, 'Alexa.VideoApp', new VideoAppLaunchDirective().setData(url, title, subtitle));
            return this;
        };
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type') === 'Display.ElementSelected') {
            alexaSkill.$type = {
                type: jovo_core_1.EnumRequestType.ON_ELEMENT_SELECTED,
                subType: _get(alexaRequest, 'request.token'),
            };
        }
    }
    output(alexaSkill) {
        const output = alexaSkill.$output;
        const response = alexaSkill.$response;
        if (alexaSkill.$request.hasScreenInterface()) {
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
                if (response && response.response && response.response.hasOwnProperty('shouldEndSession')) {
                    delete response.response.shouldEndSession;
                }
                // set sessionAttributes (necessary since AlexaCore's handler runs before us
                // and skips adding session attributes due to shouldEndSession being true at that point)
                if (alexaSkill.$session && alexaSkill.$session.$data) {
                    _set(response, 'sessionAttributes', alexaSkill.$session.$data);
                }
            }
        }
        if (_get(output, 'Alexa.deleteShouldEndSession')) {
            if (_get(response, 'response.shouldEndSession')) {
                delete response.response.shouldEndSession;
            }
        }
    }
}
exports.Display = Display;
class DisplayDirective {
    constructor(type) {
        this.type = type;
    }
}
class DisplayRenderTemplateDirective extends DisplayDirective {
    constructor(template) {
        super('Display.RenderTemplate');
        this.template = template;
    }
    setTemplate(template) {
        this.template = template;
        return this;
    }
}
class DisplayHintDirective extends DisplayDirective {
    constructor(text) {
        super('Hint');
        if (text) {
            this.setHint(text);
        }
    }
    setHint(text) {
        this.hint = {
            type: 'PlainText',
            text,
        };
        return this;
    }
}
class VideoAppLaunchDirective extends DisplayDirective {
    constructor() {
        super('VideoApp.Launch');
    }
    setVideoItem(videoItem) {
        this.videoItem = videoItem;
    }
    setData(url, title, subtitle) {
        this.videoItem = {
            source: url,
        };
        if (title) {
            this.videoItem.metadata = {
                title,
            };
            if (subtitle) {
                this.videoItem.metadata.subtitle = subtitle;
            }
        }
        return this;
    }
}
//# sourceMappingURL=Display.js.map