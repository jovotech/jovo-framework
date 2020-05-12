import { Plugin, EnumRequestType } from 'jovo-core';
import { Lindenbaum, LindenbaumBot, LindenbaumRequest } from '../../../src';

export class LindenbaumMockNlu implements Plugin {
  install(lindenbaum: Lindenbaum) {
    lindenbaum.middleware('$nlu')!.use(this.nlu.bind(this));
    lindenbaum.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  uninstall(lindenbaum: Lindenbaum) {}

  async nlu(lindenbaumBot: LindenbaumBot) {
    const request = lindenbaumBot.$request as LindenbaumRequest;
    if (lindenbaumBot.$type?.type === EnumRequestType.INTENT) {
      lindenbaumBot.$nlu = {
        intent: {
          name: request.getIntentName(),
        },
      };
    }
  }

  async inputs(lindenbaumBot: LindenbaumBot) {
    const request = lindenbaumBot.$request as LindenbaumRequest;
    lindenbaumBot.$inputs = request.getInputs();
  }
}
