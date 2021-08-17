import { IsNotEmpty, IsString, MaxLength } from '@jovotech/output';
import { SUGGESTION_TEXT_MAX_LENGTH } from '../../constants';

export class SuggestedReply {
  @IsString()
  @IsNotEmpty()
  @MaxLength(SUGGESTION_TEXT_MAX_LENGTH)
  text: string;

  @IsString()
  @IsNotEmpty()
  postbackData: string;
}
