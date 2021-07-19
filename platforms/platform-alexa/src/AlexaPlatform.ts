import {
  AnyObject,
  Entity,
  EntityMap,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Platform,
} from '@jovotech/framework';
import { AlexaOutputTemplateConverterStrategy, AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { Alexa } from './Alexa';
import { AlexaUser } from './AlexaUser';

export interface AlexaConfig extends ExtensibleConfig {
  output: {
    genericOutputToApl: boolean;
  };
}

export class AlexaPlatform extends Platform<AlexaRequest, AlexaResponse, Alexa, AlexaConfig> {
  outputTemplateConverterStrategy: AlexaOutputTemplateConverterStrategy =
    new AlexaOutputTemplateConverterStrategy();
  requestClass = AlexaRequest;
  jovoClass = Alexa;
  userClass = AlexaUser;

  getDefaultConfig(): AlexaConfig {
    return {
      output: {
        genericOutputToApl: true,
      },
    };
  }

  mount(parent: HandleRequest): void {
    parent.middlewareCollection.use('before.request', this.beforeRequest);
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

  private beforeRequest = (handleRequest: HandleRequest, jovo: Jovo) => {
    if (!(jovo.$platform instanceof AlexaPlatform)) {
      return;
    }
    // Generate generic output to APL if supported and set in config
    this.outputTemplateConverterStrategy.config.genericOutputToApl =
      jovo.$alexa?.$request?.isAplSupported() && this.config.output?.genericOutputToApl;

    if (jovo.$alexa?.$request?.request?.type === 'Alexa.Presentation.APL.UserEvent') {
      const requestArguments = jovo.$alexa.$request.request.arguments || [];
      requestArguments.forEach((argument) => {
        if (typeof argument === 'object' && argument.type === 'QuickReply') {
          if (argument.intent) {
            jovo.$nlu.intent = { name: argument.intent };
          }
          if (argument.entities) {
            const entityMap: EntityMap = {};
            argument.entities.forEach((entity: Entity) => {
              entityMap[entity.name!] = entity;
            });
            jovo.$nlu.entities = { ...entityMap };
            jovo.$entities = entityMap;
          }
        }
      });
    }
  };
}
