import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsOptional,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { ImageDisplayOptions } from '../basic-card/BasicCard';
import { Item } from './Item';

export class CarouselBrowse {
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @ArrayMinSize(2)
  @ArrayMaxSize(10)
  @Type(() => Item)
  items: Item[];

  @IsOptional()
  @IsEnum(ImageDisplayOptions)
  imageDisplayOptions?: ImageDisplayOptions;
}
