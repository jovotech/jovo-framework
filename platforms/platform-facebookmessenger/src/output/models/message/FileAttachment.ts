import { IsBoolean, IsOptional, IsUrl } from '@jovotech/output';

export class FileAttachment {
  [key: string]: unknown;

  @IsOptional()
  @IsUrl()
  url?: string;

  @IsOptional()
  @IsBoolean()
  is_reusable?: boolean;
}
