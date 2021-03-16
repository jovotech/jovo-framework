import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class PostalAddress {
  @IsOptional()
  @IsInt()
  revision?: number;

  @IsString()
  @IsNotEmpty()
  regionCode: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  languageCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  postalCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sortingCode?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  administrativeArea?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  locality?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sublocality?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  addressLines?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  recipients?: string[];

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  organization?: string;
}
