import { IsNotEmpty, IsString, MaxLength, QuickReplyValue } from '@jovotech/output';

export class Suggestion {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  title: string;

  toQuickReply?(): QuickReplyValue {
    return this.title;
  }
}
