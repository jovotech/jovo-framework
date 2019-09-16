import {SAPCAI} from "./SAPCAI";
import {Plugin, EnumRequestType, Input} from "jovo-core";
import {SAPCAIRequest} from "./SAPCAIRequest";
import {SAPCAISkill} from "./SAPCAISkill";

export class SAPCAINLU implements Plugin {

    install(sapcai: SAPCAI) {
        sapcai.middleware('$nlu')!.use(this.nlu.bind(this));
        sapcai.middleware('$inputs')!.use(this.inputs.bind(this));
    }

    uninstall(sapcai: SAPCAI) {
    }


    async nlu(sapcaiSkill: SAPCAISkill) {
        const alexaRequest = sapcaiSkill.$request as SAPCAIRequest;
        if (sapcaiSkill.$type && sapcaiSkill.$type.type === EnumRequestType.INTENT) {
            sapcaiSkill.$nlu = {
                intent: {
                    name: alexaRequest.getIntentName(),
                }
            };

        }
    }

    inputs(sapcaiSkill: SAPCAISkill) {
        const sapcaiRequest = sapcaiSkill.$request as SAPCAIRequest;
        sapcaiSkill.$inputs = sapcaiRequest.getInputs();
    }
}
