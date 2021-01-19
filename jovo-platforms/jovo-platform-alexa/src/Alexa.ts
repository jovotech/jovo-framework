import { App, ExtensibleConfig, HandleRequest, Platform } from 'jovo-core';
import { AlexaOutputConverterStrategy, AlexaResponse } from 'jovo-output-alexa';
import { AlexaRequest } from './AlexaRequest';
import { AlexaSkill } from './AlexaSkill';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface AlexaConfig extends ExtensibleConfig {}

export class Alexa extends Platform<AlexaRequest, AlexaResponse, AlexaConfig> {
  outputConverterStrategy = new AlexaOutputConverterStrategy();

  getDefaultConfig() {
    return {};
  }

  mount(parent: App): Promise<void> | void {}

  isPlatformRequest(request: Record<string, any>): boolean {
    return request.version && request.request && request.request.requestId;
  }

  createJovoInstance(app: App, handleRequest: HandleRequest): AlexaSkill {
    return new AlexaSkill(this);
  }
}
