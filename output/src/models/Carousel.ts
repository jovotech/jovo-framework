import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  CarouselItem,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from '..';
import { CarouselSelection } from './CarouselSelection';

export class Carousel {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => CarouselItem)
  items!: CarouselItem[];

  @IsOptional()
  @IsInstance(CarouselSelection)
  @ValidateNested()
  @Type(() => CarouselSelection)
  selection?: CarouselSelection;
}
