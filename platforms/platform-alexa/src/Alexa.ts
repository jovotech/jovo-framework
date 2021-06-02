import {
  Entity,
  EntityMap,
  ExtensibleConfig,
  HandleRequest,
  Jovo,
  Platform,
} from '@jovotech/framework';
import { AlexaOutputTemplateConverterStrategy, AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';
import { AlexaUser } from './AlexaUser';

export interface AlexaConfig extends ExtensibleConfig {
  genericOutputToApl?: boolean;
}

export class Alexa extends Platform<AlexaRequest, AlexaResponse, AlexaSkill, AlexaConfig> {
  outputTemplateConverterStrategy: AlexaOutputTemplateConverterStrategy =
    new AlexaOutputTemplateConverterStrategy();
  requestClass = AlexaRequest;
  jovoClass = AlexaSkill;
  userClass = AlexaUser;

  getDefaultConfig(): AlexaConfig {
    return {
      genericOutputToApl: true,
    };
  }

  mount(parent: HandleRequest): void {
    parent.middlewareCollection.use('before.request', this.beforeRequest);
  }

  isRequestRelated(request: Record<string, any> | AlexaRequest): boolean {
    return request.version && request.request && request.request.requestId;
  }

  isResponseRelated(response: Record<string, any> | AlexaResponse): boolean {
    return response.version && response.response;
  }

  finalizeResponse(
    response: AlexaResponse,
    alexaSkill: AlexaSkill,
  ): AlexaResponse | Promise<AlexaResponse> {
    response.sessionAttributes = alexaSkill.$session;
    return response;
  }

  private beforeRequest = (handleRequest: HandleRequest, jovo: Jovo) => {
    // Generate generic output to APL if supported and set in config
    (
      jovo.$platform.outputTemplateConverterStrategy as AlexaOutputTemplateConverterStrategy
    ).config.genericOutputToApl =
      jovo.$alexaSkill?.$request?.isAplSupported() && this.config.genericOutputToApl;

    if (jovo.$alexaSkill?.$request?.request?.type === 'Alexa.Presentation.APL.UserEvent') {
      const requestArguments = jovo.$alexaSkill.$request.request.arguments || [];
      requestArguments.forEach((argument) => {
        try {
          const argumentObj = JSON.parse(argument);
          if (argumentObj.type === 'QuickReply') {
            if (argumentObj.intent) {
              jovo.$nlu.intent = { name: argumentObj.intent };
            }
            if (argumentObj.entities) {
              const entityMap: EntityMap = {};
              argumentObj.entities.forEach((entity: Entity) => {
                entityMap[entity.name!] = entity;
              });
              jovo.$nlu.entities = { ...entityMap };
              jovo.$entities = entityMap;
            }
          }
        } catch (e) {
          // Ignore SyntaxError of JSON.parse, this can happen if there is a normal string which is no JSON-object.
          if (!(e instanceof SyntaxError)) {
            console.error(e);
          }
        }
      });
    }
  };
}
