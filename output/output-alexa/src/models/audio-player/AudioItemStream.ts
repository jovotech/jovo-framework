import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { AUDIO_STREAM_TOKEN_MAX_LENGTH } from '../../constants';
import { AudioItemStreamCaption } from './AudioItemStreamCaption';

export class AudioItemStream {
  @IsUrl({ protocols: ['https'] })
  url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(AUDIO_STREAM_TOKEN_MAX_LENGTH)
  token: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(AUDIO_STREAM_TOKEN_MAX_LENGTH)
  expectedPreviousToken?: string;

  @IsNumber()
  offsetInMilliseconds: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AudioItemStreamCaption)
  caption?: AudioItemStreamCaption;
}
