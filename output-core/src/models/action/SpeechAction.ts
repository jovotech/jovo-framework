import { IsNotEmpty, IsOptional, IsString, MessageValue } from '@jovotech/output';
import { IsValidSpeechActionString } from '../../decorators/validation/IsValidSpeechActionString';
import { Action, ActionType } from './Action';

export class SpeechAction extends Action<ActionType.Speech> {
  @IsValidSpeechActionString()
  ssml?: string;

  @IsValidSpeechActionString()
  plain?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayText?: string;

  toMessage?(): MessageValue {
    return {
      text: this.ssml || this.plain || '',
      displayText: this.displayText,
    };
  }
}
