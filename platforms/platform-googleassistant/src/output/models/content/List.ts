import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { COLLECTION_MIN_SIZE, LIST_MAX_SIZE } from '../../constants';

export class List {
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
  @ArrayMaxSize(LIST_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => ListItem)
  items!: ListItem[];
}

export class ListItem {
  @IsString()
  @IsNotEmpty()
  key!: string;
}
