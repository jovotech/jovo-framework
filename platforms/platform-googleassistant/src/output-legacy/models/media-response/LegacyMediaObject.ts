import { IsNotEmpty, IsString, IsUrl, Type } from '@jovotech/output';
import { IsValidMediaObjectImage } from '../../decorators/validation/IsValidMediaObjectImage';
import { LegacyImage } from '../common/LegacyImage';

export class LegacyMediaObject {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsUrl()
  contentUrl!: string;

  @IsValidMediaObjectImage()
  @Type(() => LegacyImage)
  largeImage?: LegacyImage;

  @IsValidMediaObjectImage()
  @Type(() => LegacyImage)
  icon?: LegacyImage;
}
