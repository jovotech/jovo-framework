import {
  ArrayMaxSize,
  ArrayMinSize,
  Carousel,
  IsArray,
  IsEnum,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { CAROUSEL_MAX_SIZE, CAROUSEL_MIN_SIZE } from '../../constants';
import { CardContent } from './CardContent';

export enum CardWidth {
  Unspecified = 'CARD_WIDTH_UNSPECIFIED',
  Small = 'SMALL',
  Medium = 'MEDIUM',
}

export class CarouselCard {
  @IsEnum(CardWidth)
  cardWidth: CardWidth;

  @IsArray()
  @ArrayMinSize(CAROUSEL_MIN_SIZE)
  @ArrayMaxSize(CAROUSEL_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => CardContent)
  cardContents: CardContent[];

  toCarousel?(): Carousel {
    return {
      items: this.cardContents.map((card) => card.toCard!()),
    };
  }
}
