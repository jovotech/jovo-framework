import { EnumLike } from '@jovotech/framework';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Type,
  ValidateIf,
  ValidateNested,
} from '@jovotech/output';
import { Image } from '../common/Image';
import { Link } from '../common/Link';

export class Table {
  @ValidateIf((o) => o.title || o.subtitle)
  @IsString()
  @IsNotEmpty()
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableColumn)
  columns!: TableColumn[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableRow)
  rows!: TableRow[];

  @ValidateNested()
  @Type(() => Link)
  button!: Link;
}

export enum HorizontalAlignment {
  Unspecified = 'UNSPECIFIED',
  Leading = 'LEADING',
  Center = 'CENTER',
  Trailing = 'TRAILING',
}

export type HorizontalAlignmentLike = EnumLike<HorizontalAlignment>;

export class TableColumn {
  @IsString()
  @IsNotEmpty()
  header!: string;

  @IsOptional()
  @IsEnum(HorizontalAlignment)
  align?: HorizontalAlignmentLike;
}

export class TableRow {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TableCell)
  cells!: TableCell[];

  @IsBoolean()
  divider!: boolean;
}

export class TableCell {
  @IsString()
  @IsNotEmpty()
  text!: string;
}
