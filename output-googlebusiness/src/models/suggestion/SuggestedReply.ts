import { IsNotEmpty, IsString, MaxLength } from '@jovotech/output';

export class SuggestedReply {
  @IsString()
  @IsNotEmpty()
  @MaxLength(25)
  text: string;

  @IsString()
  @IsNotEmpty()
  postbackData: string;
}
