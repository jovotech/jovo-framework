import { Type } from 'class-transformer';
import {
  IsArray,
  IsBooleanOrInstance,
  IsInstance,
  IsOptional,
  Listen,
  ListenValue,
  ValidateNested,
} from '..';
import { TransformMessage } from '../decorators/transformation/TransformMessage';
import { IsStringOrInstance } from '../decorators/validation/IsStringOrInstance';
import { Card } from './Card';
import { Carousel } from './Carousel';
import { Message, MessageValue } from './Message';
import { QuickReply, QuickReplyValue } from './QuickReply';

export type AllowNull<T> = {
  [P in keyof T]: T[P] | null;
};

export type NullableOutputTemplateBase = AllowNull<OutputTemplateBase>;

export class OutputTemplateBase {
  [key: string]: unknown;

  @IsOptional()
  @IsStringOrInstance(Message)
  @TransformMessage()
  message?: MessageValue;

  @IsOptional()
  @IsStringOrInstance(Message)
  @Type(() => Message)
  reprompt?: MessageValue;

  @IsOptional()
  @IsBooleanOrInstance(Listen)
  @Type(() => Listen)
  listen?: ListenValue;

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
