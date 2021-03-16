import { IsInt, IsNotEmpty, IsOptional, IsString, IsUrl } from '@jovotech/output';

export class Image {
  @IsUrl()
  url: string;

  @IsString()
  @IsNotEmpty()
  accessibilityText: string;

  @IsOptional()
  @IsInt()
  height?: number;

  @IsOptional()
  @IsInt()
  width?: number;
}
