import { IsOptional, IsEnum, IsUrl, IsInt } from '@jovotech/output';

export enum ImageSourceSize {
  ExtraSmall = 'X_SMALL',
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
  ExtraLarge = 'X_LARGE',
}

export class ImageSource {
  @IsUrl({ protocols: ['https'] })
  url: string;

  @IsOptional()
  @IsEnum(ImageSourceSize)
  size?: ImageSourceSize;

  @IsOptional()
  @IsInt()
  widthPixels?: number;

  @IsOptional()
  @IsInt()
  heightPixels?: number;
}
