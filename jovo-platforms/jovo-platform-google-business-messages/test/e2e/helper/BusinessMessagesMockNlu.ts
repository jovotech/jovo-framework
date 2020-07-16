import { Plugin, EnumRequestType } from 'jovo-core';
import { BusinessMessages, BusinessMessagesBot, BusinessMessagesRequest } from '../../../src';

export class BusinessMessagesMockNlu implements Plugin {
  install(businessMessages: BusinessMessages) {
    businessMessages.middleware('$nlu')!.use(this.nlu.bind(this));
    businessMessages.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  uninstall(lindenbaum: BusinessMessages) {}

  async nlu(businessMessagesBot: BusinessMessagesBot) {
    const request = businessMessagesBot.$request as BusinessMessagesRequest;
    if (businessMessagesBot.$type?.type === EnumRequestType.INTENT) {
      businessMessagesBot.$nlu = {
        intent: {
          name: request.getIntentName(),
        },
      };
    }
  }

  async inputs(businessMessagesBot: BusinessMessagesBot) {
    const request = businessMessagesBot.$request as BusinessMessagesRequest;
    businessMessagesBot.$inputs = request.getInputs();
  }
}
