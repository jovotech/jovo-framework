import { Jovo } from '@jovotech/framework';
import { AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';
import { AlexaUser } from './AlexaUser';
import { SUPPORTED_APL_ARGUMENT_TYPES } from './constants';


export class Alexa extends Jovo<AlexaRequest, AlexaResponse> {
  getSkillId(): string | undefined {
    return (
      this.$request.session?.application?.applicationId ||
      this.$request.context?.System?.application?.applicationId
    );
  }

  isResponseRelated(response: AnyObject | AlexaResponse): boolean {
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
    if (!(jovo.$platform instanceof Alexa)) {
      return;
    }
    // Generate generic output to APL if supported and set in config
    this.outputTemplateConverterStrategy.config.genericOutputToApl =
      jovo.$alexaSkill?.$request?.isAplSupported() && this.config.output?.genericOutputToApl;

    if (jovo.$alexaSkill?.$request?.request?.type === 'Alexa.Presentation.APL.UserEvent') {
      const requestArguments = jovo.$alexaSkill.$request.request.arguments || [];
      requestArguments.forEach((argument) => {
        if (typeof argument === 'object' && SUPPORTED_APL_ARGUMENT_TYPES.includes(argument?.type)) {
          if (argument.intent) {
            jovo.$nlu.intent = { name: argument.intent };
          }
          if (argument.entities) {
            const entityMap: EntityMap = argument.entities.reduce(
              (entityMap: EntityMap, entity: Entity) => {
                entityMap[entity.name] = entity;
                return entityMap;
              },
              {},
            );
            jovo.$nlu.entities = { ...entityMap };
            jovo.$entities = entityMap;
          }
        }
      });
    }
  };
}
