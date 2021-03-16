import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from '..';
import { IsStringOrInstance } from '../decorators/validation/IsStringOrInstance';
import { QuickReply, QuickReplyValue } from './QuickReply';

export type MessageValue = string | Message;

export class Message {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayText?: string;

  @IsOptional()
  @IsArray()
  @IsStringOrInstance(QuickReply, {
    each: true,
  })
  @Type(() => QuickReply)
  quickReplies?: QuickReplyValue[];
}
