"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleAction_1 = require("../core/GoogleAction");
const __1 = require("..");
class MediaResponse {
    constructor(googleAction) {
        this.googleAction = googleAction;
    }
    play(url, name, options) {
        const mediaObject = {
            name,
            contentUrl: url,
        };
        if (_get(options, 'description')) {
            mediaObject.description = _get(options, 'description');
        }
        if (_get(options, 'largeImage')) {
            mediaObject.largeImage = _get(options, 'largeImage');
        }
        if (_get(options, 'icon')) {
            mediaObject.icon = _get(options, 'icon');
        }
        _set(this.googleAction.$output, 'GoogleAssistant.MediaResponse', mediaObject);
        return this.googleAction;
    }
}
exports.MediaResponse = MediaResponse;
class MediaResponsePlugin {
    install(googleAssistant) {
        googleAssistant.middleware('$type').use(this.type.bind(this));
        googleAssistant.middleware('$output').use(this.output.bind(this));
        GoogleAction_1.GoogleAction.prototype.$audioPlayer = undefined;
        GoogleAction_1.GoogleAction.prototype.$mediaResponse = undefined;
        GoogleAction_1.GoogleAction.prototype.audioPlayer = function () {
            return this.$mediaResponse;
        };
        GoogleAction_1.GoogleAction.prototype.mediaResponse = function () {
            return this.$mediaResponse;
        };
    }
    type(googleAction) {
        if (_get(googleAction.$originalRequest || googleAction.$request, 'inputs[0].intent') ===
            'actions.intent.MEDIA_STATUS') {
            _set(googleAction.$type, 'type', jovo_core_1.EnumRequestType.AUDIOPLAYER);
            for (const argument of _get(googleAction.$originalRequest || googleAction.$request, 'inputs[0]["arguments"]', [])) {
                if (argument.name === 'MEDIA_STATUS') {
                    let status = argument.extension.status.toLowerCase();
                    status = status.charAt(0).toUpperCase() + status.slice(1);
                    _set(googleAction.$type, 'subType', `GoogleAction.${status}`);
                }
            }
        }
        googleAction.$mediaResponse = new MediaResponse(googleAction);
        googleAction.$audioPlayer = googleAction.$mediaResponse;
    }
    output(googleAction) {
        if (!googleAction.hasMediaResponseInterface()) {
            return;
        }
        if (!googleAction.$originalResponse) {
            googleAction.$originalResponse = new __1.GoogleActionResponse();
        }
        const output = googleAction.$output;
        if (_get(output, 'GoogleAssistant.MediaResponse')) {
            const richResponseItems = _get(googleAction.$originalResponse, 'richResponse.items', []);
            richResponseItems.push({
                mediaResponse: {
                    mediaType: 'AUDIO',
                    mediaObjects: [_get(output, 'GoogleAssistant.MediaResponse')],
                },
            });
            _set(googleAction.$originalResponse, 'richResponse.items', richResponseItems);
        }
    }
    uninstall(googleAssistant) { }
}
exports.MediaResponsePlugin = MediaResponsePlugin;
//# sourceMappingURL=MediaResponse.js.map