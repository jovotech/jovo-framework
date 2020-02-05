import { Plugin, EnumRequestType } from 'jovo-core';
import { Bixby } from '../Bixby';
import { BixbyCapsule } from '..';
import { BixbyRequest } from '../core/BixbyRequest';

export class BixbyNLU implements Plugin {
  install(bixby: Bixby) {
    bixby.middleware('$nlu')!.use(this.nlu.bind(this));
    bixby.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  nlu(capsule: BixbyCapsule) {
    const request = capsule.$request as BixbyRequest;
    if (capsule.$type && capsule.$type.type === EnumRequestType.INTENT) {
      capsule.$nlu = {
        intent: {
          name: request.getIntentName()!,
        },
      };
    }
  }

  inputs(capsule: BixbyCapsule) {
    const request = capsule.$request as BixbyRequest;
    capsule.$inputs = request.getInputs();
  }
}
