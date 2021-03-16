import {
  ArrayMaxSize,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateIf,
  ValidateNested,
} from '@jovotech/output';
import { Button } from '../common/Button';
import { ColumnProperties } from './ColumnProperties';
import { Image } from '../common/Image';
import { Row } from './Row';

export class TableCard {
  // title must be set if subtitle is set, otherwise it's optional
  @ValidateIf((o) => o.subtitle || o.title)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => ColumnProperties)
  columnProperties: ColumnProperties[];

  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => Row)
  rows: Row[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(1)
  @ValidateNested({
    each: true,
  })
  @Type(() => Button)
  buttons?: [Button];
}
