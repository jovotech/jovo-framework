import {
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  JovoResponse,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { convertMessageToOutputSpeech, Response } from './output';

export class AlexaResponse extends JovoResponse {
  @IsString()
  @IsNotEmpty()
  version!: string;

  @IsOptional()
  @IsObject()
  sessionAttributes?: Record<string, unknown>;

  @ValidateNested()
  @Type(() => Response)
  response!: Response;

  hasSessionEnded(): boolean {
    return !!this.response.shouldEndSession;
  }

  getSpeech(): string | string[] | undefined {
    return this.response.outputSpeech?.ssml;
  }

  getReprompt(): string | string[] | undefined {
    return this.response.reprompt?.outputSpeech?.ssml;
  }

  replaceSpeech(speech: string | string[]): void {
    // For consistency with JovoResponse, this method can also accept a string of arrays
    // However, Alexa responses use only 1 speech element, so the first item is used
    const message = Array.isArray(speech) ? speech[0] : speech;
    this.response.outputSpeech = convertMessageToOutputSpeech(message);
  }

  replaceReprompt(reprompt: string | string[]): void {
    // For consistency with JovoResponse, this method can also accept a string of arrays
    // However, Alexa responses use only 1 reprompt element, so the first item is used
    const message = Array.isArray(reprompt) ? reprompt[0] : reprompt;
    this.response.reprompt = { outputSpeech: convertMessageToOutputSpeech(message) };
  }
}
