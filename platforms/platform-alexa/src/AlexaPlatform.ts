import { AnyObject, HandleRequest, Jovo, Platform, PlatformConfig, RequiredOnlyWhere } from '@jovotech/framework';
import { Alexa } from './Alexa';
import { AlexaDevice } from './AlexaDevice';
import { AlexaRequest } from './AlexaRequest';
import { AlexaRequestBuilder } from './AlexaRequestBuilder';
import { AlexaResponse } from './AlexaResponse';
import { AlexaUser } from './AlexaUser';
import { SUPPORTED_APL_ARGUMENT_TYPES } from './constants';
import { AlexaOutputTemplateConverterStrategy } from './output';

export interface AlexaConfig extends PlatformConfig {
  output: {
    genericOutputToApl: boolean;
  };
  intentMap: Record<string, string>;
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
  readonly id: string = 'alexa';
  readonly outputTemplateConverterStrategy: AlexaOutputTemplateConverterStrategy =
    new AlexaOutputTemplateConverterStrategy();
  readonly requestClass = AlexaRequest;
  readonly jovoClass = Alexa;
  readonly userClass = AlexaUser;
  readonly deviceClass = AlexaDevice;
  readonly requestBuilder = AlexaRequestBuilder;

  getDefaultConfig(): AlexaConfig {
    return {
      intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.CancelIntent': 'END',
      },
      output: {
        genericOutputToApl: true,
      },
      intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.CancelIntent': 'END',
      },
    };
  }

  getInitConfig(): RequiredOnlyWhere<AlexaConfig, 'intentMap'> {
    return {
      intentMap: {
        'AMAZON.StopIntent': 'END',
        'AMAZON.CancelIntent': 'END',
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
