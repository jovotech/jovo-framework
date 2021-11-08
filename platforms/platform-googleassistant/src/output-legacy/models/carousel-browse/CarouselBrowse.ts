import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { CAROUSEL_MAX_SIZE, CAROUSEL_MIN_SIZE } from '../../constants';
import { ImageDisplayOptions } from '../basic-card/BasicCard';
import { Item } from './Item';

export class CarouselBrowse {
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @ArrayMinSize(CAROUSEL_MIN_SIZE)
  @ArrayMaxSize(CAROUSEL_MAX_SIZE)
  @Type(() => Item)
  items!: Item[];

  @IsOptional()
  @IsEnum(ImageDisplayOptions)
  imageDisplayOptions?: ImageDisplayOptions;
}
