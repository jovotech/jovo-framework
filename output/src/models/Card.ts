import { IsNotEmpty, IsOptional, IsString, IsUrl } from '..';

export class Card {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  key?: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  subtitle?: string;

  @IsOptional()
  @IsString()
  @IsOptional()
  content?: string;

  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
