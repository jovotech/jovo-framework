import {EnumRequestType, Plugin, SpeechBuilder} from "jovo-core";
import * as _ from "lodash";
import {GoogleAssistant} from "../GoogleAssistant";
import {GoogleAction} from "../core/GoogleAction";
import {GoogleActionResponse} from "../core/GoogleActionResponse";

export interface MediaObject {
    name: string;
    contentUrl: string;
    description?: string;
    largeImage?: any; // tslint:disable-line
    icon?: any; // tslint:disable-line
}

export class MediaResponse {
    googleAction: GoogleAction;

    constructor(googleAction: GoogleAction) {
        this.googleAction = googleAction;
    }

    play(url: string, name: string, options?: any): GoogleAction { // tslint:disable-line

        const mediaObject: MediaObject = {
            name,
            contentUrl: url,
        };

        if (_.get(options, 'description')) {
            mediaObject.description = _.get(options, 'description');
        }

        if (_.get(options, 'largeImage')) {
            mediaObject.largeImage = _.get(options, 'largeImage');
        }

        if (_.get(options, 'icon')) {
            mediaObject.icon = _.get(options, 'icon');
        }

        _.set(this.googleAction.$output, 'GoogleAssistant.MediaResponse',
            mediaObject
        );
        return this.googleAction;

    }
}


export class MediaResponsePlugin implements Plugin {

    install(googleAssistant: GoogleAssistant) {
        googleAssistant.middleware('$type')!.use(this.type.bind(this));
        googleAssistant.middleware('$output')!.use(this.output.bind(this));


        GoogleAction.prototype.$audioPlayer = undefined;
        GoogleAction.prototype.$mediaResponse = undefined;


        GoogleAction.prototype.audioPlayer = function() {
            return this.mediaResponse();
        };

        GoogleAction.prototype.mediaResponse = function() {
            if (!_.get(this.$plugins, 'MediaResponsePlugin.mediaResponse')) {
                _.set(this.$plugins, 'MediaResponsePlugin.mediaResponse', new MediaResponse(this));
            }
            return _.get(this.$plugins, 'MediaResponsePlugin.mediaResponse');
        };
    }

    type(googleAction: GoogleAction) {
        if (_.get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') === 'actions.intent.MEDIA_STATUS') {
            _.set(googleAction.$type, 'type', EnumRequestType.AUDIOPLAYER);
            for (const argument of _.get(googleAction.$originalRequest || googleAction.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'MEDIA_STATUS') {
                    let status = argument.extension.status.toLowerCase();
                    status = status.charAt(0).toUpperCase() + status.slice(1);

                    _.set(googleAction.$type, 'subType', `GoogleAction.${status}`);
                }
            }

        }
    }

    output(googleAction: GoogleAction) {

        if (!googleAction.hasMediaResponseInterface()) {
            return;
        }
        if (!googleAction.$response) {
            googleAction.$response = new GoogleActionResponse();
        }
        const output = googleAction.$output;

        if (_.get(output, 'GoogleAssistant.MediaResponse')) {
            const richResponseItems = _.get(googleAction.$response, 'richResponse.items', []);
            richResponseItems.push({
                mediaResponse: {
                    mediaType: 'AUDIO',
                    mediaObjects: [_.get(output, 'GoogleAssistant.MediaResponse')]
                }
            });
            _.set(googleAction.$response, 'richResponse.items', richResponseItems);
        }
    }
    uninstall(googleAssistant: GoogleAssistant) {

    }
}
