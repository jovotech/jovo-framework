import { Type } from 'class-transformer';
import { IsStringOrInstance } from '../decorators/validation/IsStringOrInstance';
import { IsArray, IsBoolean, IsInstance, IsOptional, ValidateNested } from '../index';
import { GenericCard } from './GenericCard';
import { GenericCarousel } from './GenericCarousel';
import { GenericMessage, Message } from './GenericMessage';
import { GenericQuickReply, QuickReply } from './GenericQuickReply';

export class GenericOutputBase {
  [key: string]: unknown;

  @IsOptional()
  @IsStringOrInstance(GenericMessage)
  @Type(() => GenericMessage)
  message?: Message;

  @IsOptional()
  @IsStringOrInstance(GenericMessage)
  @Type(() => GenericMessage)
  reprompt?: Message;

  @IsOptional()
  @IsBoolean()
  listen?: boolean;

  @IsOptional()
  @IsArray()
  @IsStringOrInstance(GenericQuickReply, {
    each: true,
  })
  @Type(() => GenericQuickReply)
  quickReplies?: QuickReply[];

  @IsOptional()
  @IsInstance(GenericCard)
  @ValidateNested()
  @Type(() => GenericCard)
  card?: GenericCard;

  @IsOptional()
  @IsInstance(GenericCarousel)
  @ValidateNested()
  @Type(() => GenericCarousel)
  carousel?: GenericCarousel;
}
