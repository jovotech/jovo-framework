import { IsNotEmpty, IsString, MaxLength, QuickReplyValue } from '@jovotech/output';
import { LEGACY_SUGGESTION_TITLE_MAX_LENGTH } from '../../constants';

export class LegacySuggestion {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LEGACY_SUGGESTION_TITLE_MAX_LENGTH)
  title!: string;

  toQuickReply?(): QuickReplyValue {
    return this.title;
  }
}
