import {
  IsArray,
  IsInstance,
  IsOptional,
  Listen,
  ListenValue,
  NullableOutputTemplateBase,
  Type,
  ValidateNested,
} from '..';
import { IsBooleanOrInstance } from '../decorators/validation/IsBooleanOrInstance';
import { IsStringOrInstance } from '../decorators/validation/IsStringOrInstance';
import { Card } from './Card';
import { Carousel } from './Carousel';
import { Message, MessageValue } from './Message';
import { QuickReply, QuickReplyValue } from './QuickReply';

export class PlatformOutputTemplate<
  RESPONSE extends Record<string, unknown> = Record<string, unknown>,
> implements NullableOutputTemplateBase
{
  [key: string]: unknown;

  @IsOptional()
  @ValidateNested()
  nativeResponse?: RESPONSE;

  @IsOptional()
  @IsStringOrInstance(Message)
  @Type(() => Message)
  message?: MessageValue | null;

  @IsOptional()
  @IsStringOrInstance(Message)
  @Type(() => Message)
  reprompt?: MessageValue | null;

  @IsOptional()
  @IsBooleanOrInstance(Listen)
  @Type(() => Listen)
  listen?: ListenValue | null;

  @IsOptional()
  @IsArray()
  @IsStringOrInstance(QuickReply, {
    each: true,
  })
  @Type(() => QuickReply)
  quickReplies?: QuickReplyValue[] | null;

  @IsOptional()
  @IsInstance(Card)
  @ValidateNested()
  @Type(() => Card)
  card?: Card | null;

  @IsOptional()
  @IsInstance(Carousel)
  @ValidateNested()
  @Type(() => Carousel)
  carousel?: Carousel | null;
}
