import { IsNotEmpty, IsOptional, IsString } from '..';

export type QuickReplyValue = string | QuickReply;

export class QuickReply {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  value?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  intent?: string;
}
