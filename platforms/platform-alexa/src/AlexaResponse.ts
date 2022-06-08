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

  getSpeech(): string | undefined {
    return this.response.outputSpeech?.ssml;
  }

  getReprompt(): string | undefined {
    return this.response.reprompt?.outputSpeech?.ssml;
  }

  setSpeech(speech: string): void {
    this.response.outputSpeech = convertMessageToOutputSpeech(speech);
  }

  setReprompt(speech: string): void {
    this.response.reprompt = { outputSpeech: convertMessageToOutputSpeech(speech) };
  }
}
