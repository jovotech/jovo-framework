import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MessageValue,
  removeSSMLSpeakTags,
} from '@jovotech/output';
import { IsValidSimpleResponseString } from '../../decorators/validation/IsValidSimpleResponseString';

export class SimpleResponse {
  @IsValidSimpleResponseString()
  textToSpeech?: string;

  @IsValidSimpleResponseString()
  ssml?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(640)
  displayText?: string;

  toMessage?(): MessageValue {
    const text = removeSSMLSpeakTags(this.ssml || this.textToSpeech || '');
    return this.displayText
      ? {
          displayText: this.displayText,
          text,
        }
      : text;
  }
}
