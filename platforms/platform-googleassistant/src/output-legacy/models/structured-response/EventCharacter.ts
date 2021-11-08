import { IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { LegacyImage } from '../common/LegacyImage';

// TODO check type of 'type' - docs did not provide possible enum-values
export class EventCharacter {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => LegacyImage)
  image?: LegacyImage;
}
