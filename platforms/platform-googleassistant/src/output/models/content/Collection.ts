import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { COLLECTION_MAX_SIZE, COLLECTION_MIN_SIZE } from '../../constants';
import { ImageFill, ImageFillLike } from '../common/Image';

export class Collection {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @IsArray()
  @ArrayMinSize(COLLECTION_MIN_SIZE)
  @ArrayMaxSize(COLLECTION_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => CollectionItem)
  items!: CollectionItem[];

  @IsOptional()
  @IsEnum(ImageFill)
  imageFill?: ImageFillLike;
}

export class CollectionItem {
  @IsString()
  @IsNotEmpty()
  key!: string;
}
