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
import { GenericCard } from './GenericCard';

export class GenericCarousel {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsArray()
  @ArrayMinSize(2)
  @IsInstance(GenericCard, {
    each: true,
  })
  @ValidateNested({
    each: true,
  })
  @Type(() => GenericCard)
  items: GenericCard[];
}
