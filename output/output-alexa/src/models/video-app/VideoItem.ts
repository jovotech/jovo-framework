import { IsOptional, IsUrl, Type, ValidateNested } from '@jovotech/output';
import { Metadata } from '../common/Metadata';

export class VideoItem {
  @IsUrl({ protocols: ['https'] })
  source: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => Metadata)
  metadata?: Metadata;
}
