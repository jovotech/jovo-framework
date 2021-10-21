import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Image } from '../common/Image';

export class Vehicle {
  @IsString()
  @IsNotEmpty()
  make: string;

  @IsString()
  @IsNotEmpty()
  model: string;

  @IsString()
  @IsNotEmpty()
  licensePlate: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  colorName?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;
}
