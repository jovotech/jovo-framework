import { Type } from 'class-transformer';
import { IsStringOrInstance } from '../decorators/validation/IsStringOrInstance';
import { IsArray, IsBoolean, IsInstance, IsOptional, ValidateNested } from '../index';
import { Card } from './Card';
import { Carousel } from './Carousel';
import { Message, MessageValue } from './Message';
import { QuickReply, QuickReplyValue } from './QuickReply';

export class OutputTemplateBase {
  [key: string]: unknown;

  @IsOptional()
  @IsStringOrInstance(Message)
  @Type(() => Message)
  message?: MessageValue;

  @IsOptional()
  @IsStringOrInstance(Message)
  @Type(() => Message)
  reprompt?: MessageValue;

  @IsOptional()
  @IsBoolean()
  listen?: boolean;

  @IsOptional()
  @IsArray()
  @IsStringOrInstance(QuickReply, {
    each: true,
  })
  @Type(() => QuickReply)
  quickReplies?: QuickReplyValue[];

  @IsOptional()
  @IsInstance(Card)
  @ValidateNested()
  @Type(() => Card)
  card?: Card;

  @IsOptional()
  @IsInstance(Carousel)
  @ValidateNested()
  @Type(() => Carousel)
  carousel?: Carousel;
}
