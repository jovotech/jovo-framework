import { Plugin, EnumRequestType } from 'jovo-core';
import { Lex } from '../Lex';
import { LexBot } from '../core/LexBot';
import { LexRequest } from '../core/LexRequest';

export class LexNLU implements Plugin {
  install(lex: Lex) {
    lex.middleware('$nlu')!.use(this.nlu.bind(this));
    lex.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  uninstall(lex: Lex) {}

  async nlu(lexBot: LexBot) {
    const lexRequest = lexBot.$request as LexRequest;
    if (lexBot.$type?.type === EnumRequestType.INTENT) {
      lexBot.$nlu = {
        intent: {
          name: lexRequest.getIntentName(),
        },
      };
    }
  }

  async inputs(lexBot: LexBot) {
    const lexRequest = lexBot.$request as LexRequest;
    lexBot.$inputs = lexRequest.getInputs();
  }
}
