import {
  IsArray,
  IsInstance,
  IsOptional,
  NullableOutputTemplateBase,
  Type,
  ValidateNested,
} from '..';
import { TransformMessage } from '../decorators/transformation/TransformMessage';
import { IsBooleanOrInstance } from '../decorators/validation/IsBooleanOrInstance';
import { IsStringOrInstance } from '../decorators/validation/IsStringOrInstance';
import { Listen, ListenValue } from './Listen';
import { Card } from './Card';
import { Carousel } from './Carousel';
import { Message, MessageValue } from './Message';
import { QuickReply, QuickReplyValue } from './QuickReply';

export class NormalizedPlatformOutputTemplate<
  RESPONSE extends Record<string, unknown> = Record<string, unknown>,
> implements NullableOutputTemplateBase
{
  [key: string]: unknown;

  @IsOptional()
  @ValidateNested()
  nativeResponse?: RESPONSE;

  @IsOptional()
  @IsStringOrInstance(Message)
  @TransformMessage()
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
