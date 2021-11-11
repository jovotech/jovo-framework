import { AnyObject, ExtensibleConfig, HandleRequest, Jovo, Platform } from '@jovotech/framework';
import { Alexa } from './Alexa';
import { AlexaDevice } from './AlexaDevice';
import { AlexaRequest } from './AlexaRequest';
import { AlexaRequestBuilder } from './AlexaRequestBuilder';
import { AlexaResponse } from './AlexaResponse';
import { AlexaUser } from './AlexaUser';
import { SUPPORTED_APL_ARGUMENT_TYPES } from './constants';
import { AlexaOutputTemplateConverterStrategy } from './output';

export interface AlexaConfig extends ExtensibleConfig {
  output: {
    genericOutputToApl: boolean;
  };
}

export class AlexaPlatform extends Platform<
  AlexaRequest,
  AlexaResponse,
  Alexa,
  AlexaUser,
  AlexaDevice,
  AlexaPlatform,
  AlexaConfig
> {
  outputTemplateConverterStrategy: AlexaOutputTemplateConverterStrategy =
    new AlexaOutputTemplateConverterStrategy();
  requestClass = AlexaRequest;
  jovoClass = Alexa;
  userClass = AlexaUser;
  deviceClass = AlexaDevice;
  requestBuilder = AlexaRequestBuilder;

  getDefaultConfig(): AlexaConfig {
    return {
      output: {
        genericOutputToApl: true,
      },
    };
  }

  mount(parent: HandleRequest): void {
    super.mount(parent);
    this.middlewareCollection.use('request.start', (jovo) => {
      return this.onRequestStart(jovo);
    });
  }

  isRequestRelated(request: AnyObject | AlexaRequest): boolean {
    return request.version && request.request && request.request.requestId;
  }

  isResponseRelated(response: AnyObject | AlexaResponse): boolean {
    return response.version && response.response;
  }

  finalizeResponse(
    response: AlexaResponse,
    alexaSkill: Alexa,
  ): AlexaResponse | Promise<AlexaResponse> {
    response.sessionAttributes = alexaSkill.$session;
    return response;
  }

  private onRequestStart(jovo: Jovo): void {
    // Generate generic output to APL if supported and set in config
    this.outputTemplateConverterStrategy.config.genericOutputToApl = !!(
      jovo.$alexa?.$request?.isAplSupported() && this.config.output?.genericOutputToApl
    );

    if (jovo.$alexa?.$request?.request?.type === 'Alexa.Presentation.APL.UserEvent') {
      const requestArguments = jovo.$alexa.$request.request.arguments || [];
      requestArguments.forEach((argument) => {
        // if the user-event is an object and is of Selection or QuickReply type
        if (typeof argument === 'object' && SUPPORTED_APL_ARGUMENT_TYPES.includes(argument?.type)) {
          if (argument.intent) {
            jovo.$input.intent = argument.intent;
          }
          if (argument.entities) {
            jovo.$input.entities = { ...argument.entities };
            jovo.$entities = argument.entities;
          }
        }
      });
    }
  }
}
