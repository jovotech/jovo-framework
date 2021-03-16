import { IsNotEmpty, IsOptional, IsString } from '@jovotech/output';

export class Image {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  image_uri?: string;

  @IsString()
  @IsNotEmpty()
  accessibility_text: string;
}
