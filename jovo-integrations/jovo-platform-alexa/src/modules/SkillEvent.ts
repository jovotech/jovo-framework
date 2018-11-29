import * as _ from "lodash";
import {AlexaSkill} from "../core/AlexaSkill";
import {AlexaRequest} from "../core/AlexaRequest";
import {EnumRequestType, Plugin} from 'jovo-core';
import {Alexa} from "../Alexa";


export class SkillEvent implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$type')!.use(this.type.bind(this));
        AlexaSkill.prototype.getBody = function() {
            return _.get(this.$request, 'request.body');
        };
        AlexaSkill.prototype.getSkillEventBody = function() {
            return _.get(this.$request, 'request.body');
        };
    }
    uninstall(alexa: Alexa) {
    }
    type(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (_.get(alexaRequest, 'request.type').substring(0, 15) === 'AlexaSkillEvent') {
            alexaSkill.$type =  {
                type: EnumRequestType.ON_EVENT,
                subType: _.get(alexaRequest, 'request.type').substring(16)
            };
        }
    }

}
