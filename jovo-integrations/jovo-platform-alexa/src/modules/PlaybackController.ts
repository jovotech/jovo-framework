import * as _ from "lodash";
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
        if (_.get(alexaRequest, 'request.type').substring(0, 18) === 'PlaybackController' ) {
            alexaSkill.$type = {
                type: EnumAlexaRequestType.PLAYBACKCONTROLLER,
                subType: _.get(alexaRequest, 'request.type').substring(19),
            };
        }
    }

}
