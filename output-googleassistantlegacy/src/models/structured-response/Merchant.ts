import { IsArray, IsNotEmpty, IsOptional, IsString, Type, ValidateNested } from '@jovotech/output';
import { Image } from '../common/Image';
import { Location } from './Location';
import { PhoneNumber } from './PhoneNumber';

export class Merchant {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  id?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Image)
  image?: Image;

  @IsOptional()
  @IsArray()
  @ValidateNested({
    each: true,
  })
  @Type(() => PhoneNumber)
  phoneNumbers?: PhoneNumber[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Location)
  address?: Location;
}
