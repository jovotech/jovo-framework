import _sample = require('lodash.sample');
import {SpeechBuilder} from "jovo-core";
import {SAPCAISkill} from "./SAPCAISkill";
import {SsmlElements} from "jovo-core/dist/src/SpeechBuilder";


export class SAPCAISpeechBuilder extends SpeechBuilder {

    constructor(sapcaiSkill: SAPCAISkill) {
        super(sapcaiSkill);
    }

}
