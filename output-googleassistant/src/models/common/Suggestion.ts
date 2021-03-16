import { IsNotEmpty, IsString, MaxLength, QuickReply } from '@jovotech/output';

export class Suggestion {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  title: string;

  toQuickReply?(): QuickReply {
    return this.title;
  }
}
