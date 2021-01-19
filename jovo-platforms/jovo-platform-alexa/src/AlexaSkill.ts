import { Jovo } from 'jovo-core';
import { AlexaResponse } from 'jovo-output-alexa';
import { AlexaRequest } from './AlexaRequest';

export class AlexaSkill extends Jovo<AlexaRequest, AlexaResponse> {}
