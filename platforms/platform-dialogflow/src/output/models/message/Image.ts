import { IsNotEmpty, IsOptional, IsString, IsUrl } from '@jovotech/output';

export class Image {
  @IsOptional()
  @IsUrl()
  image_uri?: string;

  @IsString()
  @IsNotEmpty()
  accessibility_text!: string;
}
