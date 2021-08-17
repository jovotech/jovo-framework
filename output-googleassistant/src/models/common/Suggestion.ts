import { IsNotEmpty, IsString, MaxLength, QuickReply, QuickReplyValue } from '@jovotech/output';
import { SUGGESTION_TITLE_MAX_LENGTH } from '../../constants';

export class Suggestion {
  @IsString()
  @IsNotEmpty()
  @MaxLength(SUGGESTION_TITLE_MAX_LENGTH)
  title: string;

  toQuickReply?(): QuickReplyValue {
    return this.title;
  }
}
