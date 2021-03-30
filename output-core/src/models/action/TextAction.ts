import { IsNotEmpty, MessageValue } from '@jovotech/output';
import { IsString } from '@jovotech/output';
import { Action, ActionType } from './Action';

export class TextAction extends Action<ActionType.Text> {
  @IsString()
  @IsNotEmpty()
  text: string;

  toMessage?(): MessageValue {
    return {
      text: this.text,
    };
  }
}
