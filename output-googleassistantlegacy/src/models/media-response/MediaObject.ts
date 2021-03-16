import { IsNotEmpty, IsString, IsUrl, Type } from '@jovotech/output';
import { IsValidMediaObjectImage } from '../../decorators/validation/IsValidMediaObjectImage';
import { Image } from '../common/Image';

export class MediaObject {
  @IsString()
  @IsNotEmpty()
  name: string;
  @IsString()
  @IsNotEmpty()
  description: string;
  @IsUrl()
  contentUrl: string;

  @IsValidMediaObjectImage()
  @Type(() => Image)
  largeImage?: Image;

  @IsValidMediaObjectImage()
  @Type(() => Image)
  icon?: Image;
}
