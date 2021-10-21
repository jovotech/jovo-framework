import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { LatLng } from './LatLng';
import { PostalAddress } from './PostalAddress';

export class Location {
  @IsOptional()
  @ValidateNested()
  @Type(() => LatLng)
  coordinates?: LatLng;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  formattedAddress?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  zipCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  city?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => PostalAddress)
  postalAddress?: PostalAddress;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @IsOptional()
  @IsPhoneNumber()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  notes?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  placeId?: string;
}
