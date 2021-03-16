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
import { AudioItemStreamCaption } from './AudioItemStreamCaption';

export class AudioItemStream {
  @IsUrl({ protocols: ['https'] })
  url: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  token: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(1024)
  expectedPreviousToken?: string;

  @IsNumber()
  offsetInMilliseconds: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => AudioItemStreamCaption)
  caption?: AudioItemStreamCaption;
}
