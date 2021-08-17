import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from '@jovotech/output';
import { QUICK_REPLIES_MAX_SIZE, QUICK_REPLY_MAX_LENGTH } from '../../constants';

export class QuickReplies {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(QUICK_REPLIES_MAX_SIZE)
  @MaxLength(QUICK_REPLY_MAX_LENGTH, { each: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  quick_replies?: string[];
}
