import { Extensible, ExtensibleConfig, HandleRequest, Jovo, Platform } from '@jovotech/framework';
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

  isRequestRelated(request: Record<string, any> | AlexaRequest): boolean {
    return request.version && request.request && request.request.requestId;
  }

  isResponseRelated(response: Record<string, any> | AlexaResponse): boolean {
    return response.version && response.response;
  }

  mount(parent: Extensible): void {
    parent.middlewareCollection.use(
      'before.request',
      (handleRequest: HandleRequest, jovo: Jovo) => {
        (
          jovo.$platform.outputTemplateConverterStrategy as AlexaOutputTemplateConverterStrategy
        ).config.genericOutputToApl =
          jovo.$alexaSkill?.$request?.isAplSupported() && this.config.genericOutputToApl;
      },
    );
  }

  finalizeResponse(
    response: AlexaResponse,
    alexaSkill: AlexaSkill,
  ): AlexaResponse | Promise<AlexaResponse> {
    response.sessionAttributes = alexaSkill.$session;
    return response;
  }
}
