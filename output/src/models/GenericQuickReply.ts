import { IsNotEmpty, IsOptional, IsString } from '..';

export type QuickReply = string | GenericQuickReply;

export class GenericQuickReply {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  value?: string;
}
