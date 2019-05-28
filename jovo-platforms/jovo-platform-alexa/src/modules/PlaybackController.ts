import _get = require('lodash.get');

import {AlexaSkill} from "../core/AlexaSkill";
import {AlexaRequest} from "../core/AlexaRequest";
import {Plugin} from 'jovo-core';
import {Alexa} from "../Alexa";
import {EnumAlexaRequestType} from "../core/alexa-enums";


export class PlaybackController implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$type')!.use(this.type.bind(this));
    }
    uninstall(alexa: Alexa) {
    }
    type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (_get(alexaRequest, 'request.type').substring(0, 18) === 'PlaybackController' ) {
            alexaSkill.$type = {
                type: EnumAlexaRequestType.PLAYBACKCONTROLLER,
                subType: _get(alexaRequest, 'request.type').substring(19),
            };
        }
    }

}
