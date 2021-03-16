import { Jovo } from '@jovotech/core';
import { AlexaResponse } from '@jovotech/output-alexa';
import { AlexaRequest } from './AlexaRequest';

export class AlexaSkill extends Jovo<AlexaRequest, AlexaResponse> {}
