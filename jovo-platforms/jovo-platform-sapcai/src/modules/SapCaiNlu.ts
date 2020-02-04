import { SapCai } from '../SapCai';
import { EnumRequestType, Plugin } from 'jovo-core';
import { SapCaiRequest, SapCaiSkill } from '..';

export class SapCaiNlu implements Plugin {
  install(sapcai: SapCai) {
    sapcai.middleware('$nlu')!.use(this.nlu.bind(this));
    sapcai.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  uninstall(sapcai: SapCai) {}

  async nlu(caiSkill: SapCaiSkill) {
    const alexaRequest = caiSkill.$request as SapCaiRequest;
    if (caiSkill.$type && caiSkill.$type.type === EnumRequestType.INTENT) {
      caiSkill.$nlu = {
        intent: {
          name: alexaRequest.getIntentName(),
        },
      };
    }
  }

  inputs(caiSkill: SapCaiSkill) {
    const request = caiSkill.$request as SapCaiRequest;
    caiSkill.$inputs = request.getInputs();
  }
}
