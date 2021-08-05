import { IsNotEmpty, IsOptional, IsString } from '..';

export type MessageValue = string | Message;

export class Message {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayText?: string;
}
