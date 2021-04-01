import { ExtensibleConfig, Jovo, Platform } from '@jovotech/core';
import { AlexaOutputTemplateConverterStrategy, AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';

export interface AlexaConfig extends ExtensibleConfig {}

export class Alexa extends Platform<AlexaRequest, AlexaResponse, AlexaConfig> {
  outputTemplateConverterStrategy = new AlexaOutputTemplateConverterStrategy();
  requestClass = AlexaRequest;
  jovoClass = AlexaSkill;

  getDefaultConfig() {
    return {};
  }

  isRequestRelated(request: Record<string, any> | AlexaRequest): boolean {
    return request.version && request.request && request.request.requestId;
  }

  prepareResponse(response: AlexaResponse, jovo: Jovo): AlexaResponse | Promise<AlexaResponse> {
    this.setResponseSessionData(response, jovo);
    return response;
  }

  setResponseSessionData(response: AlexaResponse, jovo: Jovo): this {
    response.sessionAttributes = jovo.$session.$data;
    return this;
  }
}
