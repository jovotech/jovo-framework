import { IsArray, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class QuickReplies {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  quick_replies?: string[];
}
