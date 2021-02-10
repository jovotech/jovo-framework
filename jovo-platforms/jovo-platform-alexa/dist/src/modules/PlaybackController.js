"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _get = require("lodash.get");
const alexa_enums_1 = require("../core/alexa-enums");
class PlaybackController {
    install(alexa) {
        alexa.middleware('$type').use(this.type.bind(this));
    }
    uninstall(alexa) { }
    type(alexaSkill) {
        const alexaRequest = alexaSkill.$request;
        if (_get(alexaRequest, 'request.type').substring(0, 18) === 'PlaybackController') {
            alexaSkill.$type = {
                type: alexa_enums_1.EnumAlexaRequestType.PLAYBACKCONTROLLER,
                subType: _get(alexaRequest, 'request.type').substring(19),
            };
        }
    }
}
exports.PlaybackController = PlaybackController;
//# sourceMappingURL=PlaybackController.js.map