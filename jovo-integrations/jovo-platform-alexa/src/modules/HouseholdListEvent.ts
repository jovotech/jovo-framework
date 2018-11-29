import * as _ from "lodash";
import {AlexaSkill} from "../core/AlexaSkill";
import {AlexaRequest} from "../core/AlexaRequest";
import {EnumRequestType, Plugin} from 'jovo-core';
import {Alexa} from "../Alexa";

export class HouseholdListEvent implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$type')!.use(this.type.bind(this));
    }
    uninstall(alexa: Alexa) {
    }
    type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (_.get(alexaRequest, 'request.type').substring(0, 23) === 'AlexaHouseholdListEvent') {
            alexaSkill.$type = {
                type: EnumRequestType.ON_EVENT,
                subType: _.get(alexaRequest, 'request.type').substring(24)
            };
        }

    }

}
