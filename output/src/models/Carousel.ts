import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsInstance,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from '..';
import { Card } from './Card';

export class Carousel {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsInstance(Card, {
    each: true,
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => Card)
  items: Card[];
}
