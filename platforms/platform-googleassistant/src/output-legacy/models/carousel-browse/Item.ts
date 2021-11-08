import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { LegacyImage } from '../common/LegacyImage';
import { OpenUrlAction } from '../common/OpenUrlAction';

export class Item {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  footer?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LegacyImage)
  image?: LegacyImage;

  @ValidateNested()
  @Type(() => OpenUrlAction)
  openUrlAction!: OpenUrlAction;
}
