import { IsEnum, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export enum LegacyHorizontalAlignment {
  Leading = 'LEADING',
  Center = 'CENTER',
  Trailing = 'TRAILING',
}

export class ColumnProperties {
  @IsString()
  @IsNotEmpty()
  header!: string;

  @IsOptional()
  @IsEnum(LegacyHorizontalAlignment)
  horizontalAlignment?: LegacyHorizontalAlignment;
}
