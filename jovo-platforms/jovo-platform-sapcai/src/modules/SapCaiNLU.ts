import { SapCai } from '../SapCai';
import { EnumRequestType, Plugin } from 'jovo-core';
import { SapCaiRequest, SapCaiSkill } from '..';

export class SapCaiNLU implements Plugin {
  install(sapcai: SapCai) {
    sapcai.middleware('$nlu')!.use(this.nlu.bind(this));
    sapcai.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  uninstall(sapcai: SapCai) {}

  async nlu(sapcaiSkill: SapCaiSkill) {
    const alexaRequest = sapcaiSkill.$request as SapCaiRequest;
    if (sapcaiSkill.$type && sapcaiSkill.$type.type === EnumRequestType.INTENT) {
      sapcaiSkill.$nlu = {
        intent: {
          name: alexaRequest.getIntentName(),
        },
      };
    }
  }

  inputs(sapcaiSkill: SapCaiSkill) {
    const sapcaiRequest = sapcaiSkill.$request as SapCaiRequest;
    sapcaiSkill.$inputs = sapcaiRequest.getInputs();
  }
}
