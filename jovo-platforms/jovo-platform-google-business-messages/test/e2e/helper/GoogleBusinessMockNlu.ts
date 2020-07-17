import { EnumRequestType, Plugin } from 'jovo-core';
import { GoogleBusiness, GoogleBusinessBot, GoogleBusinessRequest } from '../../../src';

export class GoogleBusinessMockNlu implements Plugin {
  install(googleBusiness: GoogleBusiness) {
    googleBusiness.middleware('$nlu')!.use(this.nlu.bind(this));
    googleBusiness.middleware('$inputs')!.use(this.inputs.bind(this));
  }

  async nlu(googleBusinessBot: GoogleBusinessBot) {
    const request = googleBusinessBot.$request as GoogleBusinessRequest;
    if (googleBusinessBot.$type?.type === EnumRequestType.INTENT) {
      googleBusinessBot.$nlu = {
        intent: {
          name: request.getIntentName(),
        },
      };
    }
  }

  async inputs(googleBusinessBot: GoogleBusinessBot) {
    const request = googleBusinessBot.$request as GoogleBusinessRequest;
    googleBusinessBot.$inputs = request.getInputs();
  }
}
