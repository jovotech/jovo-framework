import {
  ArrayMaxSize,
  ArrayMinSize,
  EnumLike,
  IsArray,
  IsEnum,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { RBM_CAROUSEL_MAX_SIZE, RBM_CAROUSEL_MIN_SIZE } from '../../../constants';
import { RbmCardContent } from './RbmCardContent';

export enum CardWidth {
  Unspecified = 'CARD_WIDTH_UNSPECIFIED',
  Small = 'SMALL',
  Medium = 'MEDIUM',
}

export type CardWidthLike = EnumLike<CardWidth>;

export class RbmCarouselCard {
  @IsEnum(CardWidth)
  card_width: CardWidthLike;

  @IsArray()
  @ArrayMinSize(RBM_CAROUSEL_MIN_SIZE)
  @ArrayMaxSize(RBM_CAROUSEL_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => RbmCardContent)
  card_contents: RbmCardContent[];
}
