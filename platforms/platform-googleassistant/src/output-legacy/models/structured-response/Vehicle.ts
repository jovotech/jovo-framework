import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { LegacyImage } from '../common/LegacyImage';

export class Vehicle {
  @IsString()
  @IsNotEmpty()
  make!: string;

  @IsString()
  @IsNotEmpty()
  model!: string;

  @IsString()
  @IsNotEmpty()
  licensePlate!: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  colorName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LegacyImage)
  image?: LegacyImage;
}
