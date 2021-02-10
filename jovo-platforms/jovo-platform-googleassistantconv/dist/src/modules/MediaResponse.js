"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jovo_core_1 = require("jovo-core");
const _set = require("lodash.set");
const _get = require("lodash.get");
const GoogleAction_1 = require("../core/GoogleAction");
class MediaResponse {
    constructor(googleAction) {
        this.googleAction = googleAction;
    }
    playAudio(mediaObjects, startOffset = '0s', optionalMediaControls = ['PAUSED', 'STOPPED']) {
        const mObjects = Array.isArray(mediaObjects) ? mediaObjects : [mediaObjects];
        const media = {
            mediaType: 'AUDIO',
            mediaObjects: mObjects,
            startOffset,
            optionalMediaControls,
        };
        if (!this.googleAction.$output.GoogleAssistant) {
            this.googleAction.$output.GoogleAssistant = {};
        }
        this.googleAction.$output.GoogleAssistant.media = media;
        return this.googleAction;
    }
    getProgress() {
        var _a;
        return (_a = this.googleAction.$request.context) === null || _a === void 0 ? void 0 : _a.media.progress;
    }
    play(url, name, options) {
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
        if (_get(googleAction.$request, 'intent.name', '').startsWith('actions.intent.MEDIA_STATUS')) {
            _set(googleAction.$type, 'type', jovo_core_1.EnumRequestType.AUDIOPLAYER);
            const status = googleAction.$request.intent.params
                .MEDIA_STATUS.resolved;
            const toCapitalCase = (str) => {
                str = str.toLowerCase();
                return str.charAt(0).toUpperCase() + str.slice(1);
            };
            _set(googleAction.$type, 'subType', `GoogleAction.${toCapitalCase(status)}`);
        }
        googleAction.$mediaResponse = new MediaResponse(googleAction);
        googleAction.$audioPlayer = googleAction.$mediaResponse;
    }
    output(googleAction) {
        var _a;
        if (!googleAction.hasMediaResponseInterface()) {
            return;
        }
        const output = googleAction.$output;
        if ((_a = output.GoogleAssistant) === null || _a === void 0 ? void 0 : _a.media) {
            _set(googleAction.$response, 'prompt.content.media', output.GoogleAssistant.media);
        }
    }
    uninstall(googleAssistant) { }
}
exports.MediaResponsePlugin = MediaResponsePlugin;
//# sourceMappingURL=MediaResponse.js.map