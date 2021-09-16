import { IsNotEmpty, IsOptional, IsString } from '..';

export type MessageValue = string | Message;

export class Message {
  @IsString()
  @IsNotEmpty()
  speech: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  text?: string;
}
