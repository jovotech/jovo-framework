import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from '@jovotech/output';

export class QuickReplies {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @MaxLength(20, { each: true })
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  quick_replies?: string[];
}
