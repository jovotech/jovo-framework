import { IsBoolean, IsNotEmpty, IsOptional, IsString, IsUrl } from '@jovotech/output';

export class ContentInfo {
  @IsUrl()
  fileUrl: string;

  @IsString()
  @IsNotEmpty()
  altText: string;

  @IsOptional()
  @IsUrl()
  thumbnailUrl?: string;

  @IsOptional()
  @IsBoolean()
  forceRefresh?: boolean;
}
