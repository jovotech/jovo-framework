import {Alexa} from "../Alexa";
import {Plugin, EnumRequestType} from "jovo-core";
import * as _ from "lodash";
import {AlexaRequest} from "../core/AlexaRequest";
import {AlexaSkill} from "../core/AlexaSkill";

export class AlexaNLU implements Plugin {

    install(alexa: Alexa) {
        alexa.middleware('$nlu')!.use(this.nlu.bind(this));
        alexa.middleware('$inputs')!.use(this.inputs.bind(this));
    }

    uninstall(alexa: Alexa) {
    }


    async nlu(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        if (alexaSkill.$type && alexaSkill.$type.type === EnumRequestType.INTENT) {

            alexaSkill.$nlu = {
                intent: {
                    name: alexaRequest.getIntentName(),
                }
            };

        }
    }

    inputs(alexaSkill: AlexaSkill) {
        const alexaRequest = alexaSkill.$request as AlexaRequest;
        const slots = alexaRequest.getSlots();
        if (slots) {
            Object.keys(slots).forEach((slotKey) => {
                const slot = slots[slotKey];
                const input: any = { // tslint:disable-line
                    name: slotKey,
                };

                if (slot.value) {
                    input.value = slot.value;
                    input.key = slot.value;
                }

                if (_.get(slot, 'resolutions.resolutionsPerAuthority[0].values[0]')) {
                    input.key = _.get(slot, 'resolutions.resolutionsPerAuthority[0].values[0]').value.name;
                    input.id = _.get(slot, 'resolutions.resolutionsPerAuthority[0].values[0]').value.id;
                }
                input.alexaSkill = slot;

                if (!alexaSkill.$inputs) {
                    alexaSkill.$inputs = {};
                }
                alexaSkill.$inputs[slotKey] = input;
            });
        }
    }
}
