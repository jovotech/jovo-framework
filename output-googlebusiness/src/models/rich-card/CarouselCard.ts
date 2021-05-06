import {
  ArrayMaxSize,
  ArrayMinSize,
  Carousel,
  IsArray,
  IsEnum,
  Type,
  ValidateNested,
} from '@jovotech/output';
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
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @ValidateNested({ each: true })
  @Type(() => CardContent)
  cardContents: CardContent[];

  toCarousel?(): Carousel {
    return {
      items: this.cardContents.map((card) => card.toCard!()),
    };
  }
}
