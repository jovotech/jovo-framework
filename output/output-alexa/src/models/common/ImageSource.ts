import { EnumLike, IsEnum, IsInt, IsOptional, IsUrl } from '@jovotech/output';

export enum ImageSourceSize {
  ExtraSmall = 'X_SMALL',
  Small = 'SMALL',
  Medium = 'MEDIUM',
  Large = 'LARGE',
  ExtraLarge = 'X_LARGE',
}

export type ImageSourceSizeLike = EnumLike<ImageSourceSize>;

export class ImageSource {
  @IsUrl({ protocols: ['https'] })
  url: string;

  @IsOptional()
  @IsEnum(ImageSourceSize)
  size?: ImageSourceSizeLike;

  @IsOptional()
  @IsInt()
  widthPixels?: number;

  @IsOptional()
  @IsInt()
  heightPixels?: number;
}
