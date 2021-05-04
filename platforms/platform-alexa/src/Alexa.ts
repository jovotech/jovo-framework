import { ExtensibleConfig, Jovo, Platform } from '@jovotech/framework';
import { AlexaOutputTemplateConverterStrategy, AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';
import { AlexaUser } from './AlexaUser';

export interface AlexaConfig extends ExtensibleConfig {}

export class Alexa extends Platform<AlexaRequest, AlexaResponse, AlexaSkill, AlexaConfig> {
  outputTemplateConverterStrategy = new AlexaOutputTemplateConverterStrategy();
  requestClass = AlexaRequest;
  jovoClass = AlexaSkill;
  userClass = AlexaUser;

  getDefaultConfig() {
    return {};
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
}
