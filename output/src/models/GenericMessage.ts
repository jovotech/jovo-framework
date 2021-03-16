import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsOptional, IsString } from '..';
import { IsStringOrInstance } from '../decorators/validation/IsStringOrInstance';
import { GenericQuickReply, QuickReply } from './GenericQuickReply';

export type Message = string | GenericMessage;

export class GenericMessage {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  displayText?: string;

  @IsOptional()
  @IsArray()
  @IsStringOrInstance(GenericQuickReply, {
    each: true,
  })
  @Type(() => GenericQuickReply)
  quickReplies?: QuickReply[];
}
