import { IsArray, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '..';
import { Entity } from './Entity';

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

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Entity)
  entities?: Entity[];
}
