import {
  AnyObject,
  Entity,
  EntityMap,
  ExtensibleConfig,
  HandleRequest,
  InputType,
  Jovo,
  Platform,
} from '@jovotech/framework';
import { AlexaOutputTemplateConverterStrategy, AlexaResponse } from '@jovotech/output-alexa';
import { Alexa } from './Alexa';
import { AlexaDevice } from './AlexaDevice';
import { AlexaRequest } from './AlexaRequest';
import { AlexaUser } from './AlexaUser';
import { SUPPORTED_APL_ARGUMENT_TYPES } from './constants';

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

  getDefaultConfig(): AlexaConfig {
    return {
      output: {
        genericOutputToApl: true,
      },
    };
  }

  mount(parent: HandleRequest): void {
    parent.middlewareCollection.use('request.start', this.onRequestStart);
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

  private onRequestStart = (jovo: Jovo) => {
    if (!(jovo.$platform instanceof AlexaPlatform)) {
      return;
    }
    // Generate generic output to APL if supported and set in config
    this.outputTemplateConverterStrategy.config.genericOutputToApl = !!(
      jovo.$alexa?.$request?.isAplSupported() && this.config.output?.genericOutputToApl
    );

    if (jovo.$alexa?.$request?.request?.type === 'Alexa.Presentation.APL.UserEvent') {
      const requestArguments = jovo.$alexa.$request.request.arguments || [];
      requestArguments.forEach((argument) => {
        // if the user-event is an object and is of Selection or QuickReply type
        if (typeof argument === 'object' && SUPPORTED_APL_ARGUMENT_TYPES.includes(argument?.type)) {
          jovo.$input.type = InputType.Intent;
          if (argument.intent) {
            jovo.$input.intent = argument.intent;
          }
          if (argument.entities) {
            const entityMap: EntityMap = argument.entities.reduce(
              (entityMap: EntityMap, entity: Entity) => {
                entityMap[entity.name] = entity;
                return entityMap;
              },
              {},
            );
            jovo.$input.entities = { ...entityMap };
            jovo.$entities = entityMap;
          }
        }
      });
    }
  };
}
