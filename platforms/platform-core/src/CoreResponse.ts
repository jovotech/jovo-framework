import {
  IsArray,
  IsNotEmpty,
  IsString,
  JovoResponse,
  NormalizedOutputTemplate,
  SpeechMessage,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { CoreResponseContext } from '.';

export class CoreResponse extends JovoResponse {
  @IsString()
  @IsNotEmpty()
  version!: string;

  @IsString()
  @IsNotEmpty()
  platform!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => NormalizedOutputTemplate)
  output!: NormalizedOutputTemplate[];

  @ValidateNested()
  @Type(() => CoreResponseContext)
  context!: CoreResponseContext;

  hasSessionEnded(): boolean {
    return this.context.session.end;
  }

  getSpeech(): string | string[] | undefined {
    let speech: string[] = [];
    this.output.forEach((output) => {
      if (output.message) {
        // The message property can either be a string or an object with a speech property.
        if (typeof output.message === 'object' && output.message.speech) {
          speech.push(output.message.speech);
        }
        if (typeof output.message === 'string') {
          speech.push(output.message);
        }
      }
    });

    if (speech.length === 1) {
      return speech[0];
    }

    if (speech.length === 0) {
      return undefined;
    }

    return speech;
  }

  getReprompt(): string | string[] | undefined {
    let reprompts: string[] = [];
    this.output.forEach((output) => {
      if (output.reprompt) {
        // The reprompt property can either be a string or an object with a speech property.
        if (typeof output.reprompt === 'object' && output.reprompt.speech) {
          reprompts.push(output.reprompt.speech);
        }
        if (typeof output.reprompt === 'string') {
          reprompts.push(output.reprompt);
        }
      }
    });

    if (reprompts.length === 1) {
      return reprompts[0];
    }

    if (reprompts.length === 0) {
      return undefined;
    }

    return reprompts;
  }

  replaceSpeech(speech: string | string[]): void {
    const speechArray = Array.isArray(speech) ? speech : [speech];

    for (let speechIndex = 0; speechIndex < speechArray.length; speechIndex++) {
      for (let outputIndex = speechIndex; outputIndex < this.output.length; outputIndex++) {
        if (this.output[outputIndex].message) {
          if (typeof this.output[outputIndex].message === 'string') {
            this.output[outputIndex].message = speechArray[speechIndex];
            break; // continue with the next speech item (outer loop)
          }

          if (typeof this.output[outputIndex].message === 'object') {
            // TODO: Clean this up
            (this.output[outputIndex].message as SpeechMessage).speech = speechArray[speechIndex];
            break; // continue with the next speech item (outer loop)
          }
        }
      }
    }
  }

  replaceReprompt(reprompt: string | string[]): void {
    const repromptArray = Array.isArray(reprompt) ? reprompt : [reprompt];

    for (let repromptIndex = 0; repromptIndex < repromptArray.length; repromptIndex++) {
      for (let outputIndex = repromptIndex; outputIndex < this.output.length; outputIndex++) {
        if (this.output[outputIndex].reprompt) {
          if (typeof this.output[outputIndex].reprompt === 'string') {
            this.output[outputIndex].reprompt = repromptArray[repromptIndex];
            break; // continue with the next reprompt item (outer loop)
          }

          if (typeof this.output[outputIndex].reprompt === 'object') {
            // TODO: Clean this up
            (this.output[outputIndex].reprompt as SpeechMessage).speech =
              repromptArray[repromptIndex];
            break; // continue with the next reprompt item (outer loop)
          }
        }
      }
    }
  }
}
