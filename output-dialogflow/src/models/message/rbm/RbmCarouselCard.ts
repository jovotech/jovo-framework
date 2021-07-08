import {
  ArrayMaxSize,
  ArrayMinSize,
  EnumLike,
  IsArray,
  IsEnum,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { RbmCardContent } from './RbmCardContent';

export enum CardWidth {
  Unspecified = 'CARD_WIDTH_UNSPECIFIED',
  Small = 'SMALL',
  Medium = 'MEDIUM',
}

export type CardWidthLike = EnumLike<CardWidth>

export class RbmCarouselCard {
  @IsEnum(CardWidth)
  card_width: CardWidthLike;

  @IsArray()
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => RbmCardContent)
  card_contents: RbmCardContent[];
}
