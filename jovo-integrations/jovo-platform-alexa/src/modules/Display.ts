import * as _ from "lodash";
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

        AlexaSkill.prototype.showDisplayTemplate = function(template: Template) {
            _.set(this.$output, 'Alexa.DisplayTemplate',
                new DisplayRenderTemplateDirective(template)
            );
            return this;
        };

        AlexaSkill.prototype.showHint = function(text: string) {
            _.set(this.$output, 'Alexa.DisplayHint',
                new DisplayHintDirective(text)
            );
            return this;
        };

        AlexaSkill.prototype.showVideo = function(url: string, title?: string, subtitle?: string) {
            _.set(this.$output, 'Alexa.VideoApp',
                (new VideoAppLaunchDirective()).setData(url, title, subtitle)
            );
            return this;
        };
    }
    uninstall(alexa: Alexa) {

    }
    type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (_.get(alexaRequest, 'request.type') === 'Display.ElementSelected' ||
        _.get(alexaRequest, 'request.type') === 'Alexa.Presentation.APL.UserEvent') {
            alexaSkill.$type = {
                type: EnumRequestType.ON_ELEMENT_SELECTED,
                subType: _.get(alexaRequest, 'request.token')
            };
        }
    }
    output(alexaSkill: AlexaSkill) {
        const output = alexaSkill.$output;
        const response = alexaSkill.$response as AlexaResponse;

        //TODO:
        // if (alexaSkill.$request.hasScreenInterface()) {
            if (_.get(output, 'Alexa.DisplayTemplate')) {

                _.set(response, 'response.directives',
                    [_.get(output, 'Alexa.DisplayTemplate')]
                );
            }

        if (_.get(output, 'Alexa.DisplayHint')) {
            if (!_.get(response, 'response.directives')) {
                _.set(response, 'response.directives',
                    [_.get(output, 'Alexa.DisplayHint')]);
            } else {
                _.get(response, 'response.directives').push(_.get(output, 'Alexa.DisplayHint'));
            }
        }

        if (_.get(output, 'Alexa.VideoApp')) {
                //TODO: doesn't work with ask
            _.set(response, 'response.directives',
                [_.get(output, 'Alexa.VideoApp')]
            );
            if (_.get(response, 'response.shouldEndSession')) {
                delete response.response.shouldEndSession;
            }
        }
        // }
    }
}


// TODO: Optimize me
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
