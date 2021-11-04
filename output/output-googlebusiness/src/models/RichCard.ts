import { Type } from '@jovotech/output';
import { IsValidRichCardObject } from '../decorators/validation/IsValidRichCardObject';
import { CarouselCard } from './rich-card/CarouselCard';
import { StandaloneCard } from './rich-card/StandaloneCard';

export class RichCard {
  @IsValidRichCardObject()
  @Type(() => StandaloneCard)
  standaloneCard?: StandaloneCard;

  @IsValidRichCardObject()
  @Type(() => CarouselCard)
  carouselCard?: CarouselCard;
}
