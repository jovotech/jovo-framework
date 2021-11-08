import { IsOptional, Type, ValidateNested } from '..';
import { Card } from './Card';
import { CarouselItemSelection } from './CarouselItemSelection';

export class CarouselItem extends Card {
  @IsOptional()
  @ValidateNested()
  @Type(() => CarouselItemSelection)
  selection?: CarouselItemSelection;
}
