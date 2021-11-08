import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MessageValue,
  SpeechMessage,
  TextMessage,
} from '@jovotech/output';
import { SIMPLE_RESPONSE_DISPLAY_TEXT_MAX_LENGTH } from '../../constants';
import { IsValidSimpleResponseString } from '../../decorators/validation/IsValidSimpleResponseString';

export class SimpleResponse {
  @IsValidSimpleResponseString()
  textToSpeech?: string;

  @IsValidSimpleResponseString()
  ssml?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(SIMPLE_RESPONSE_DISPLAY_TEXT_MAX_LENGTH)
  displayText?: string;

  toMessage?(): MessageValue {
    const message = {} as SpeechMessage | TextMessage;
    if (this.displayText) {
      message.text = this.displayText;
    }
    if (this.ssml || this.textToSpeech) {
      message.speech = this.ssml || this.textToSpeech;
    }
    return message;
  }
}
