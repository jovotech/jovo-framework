import { App, HandleRequest, Jovo } from '@jovotech/core';
import { AlexaResponse } from '@jovotech/output-alexa';
import { Alexa } from './Alexa';
import { AlexaRequest } from './AlexaRequest';

export class AlexaSkill extends Jovo<AlexaRequest, AlexaResponse> {
}
