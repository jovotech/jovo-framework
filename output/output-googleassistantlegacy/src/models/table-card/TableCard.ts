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
import { TABLE_CARD_BUTTONS_MAX_SIZE } from '../../constants';
import { Button } from '../common/Button';
import { Image } from '../common/Image';
import { ColumnProperties } from './ColumnProperties';
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
  @ArrayMaxSize(TABLE_CARD_BUTTONS_MAX_SIZE)
  @ValidateNested({
    each: true,
  })
  @Type(() => Button)
  buttons?: [Button];
}
