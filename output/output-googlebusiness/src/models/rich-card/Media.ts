import { IsEnum, Type, ValidateNested } from '@jovotech/output';
import { ContentInfo } from '../common/ContentInfo';

export enum MediaHeight {
  Unspecified = 'HEIGHT_UNSPECIFIED',
  Short = 'SHORT',
  Medium = 'MEDIUM',
  Tall = 'TALL',
}

export class Media {
  @IsEnum(MediaHeight)
  height: MediaHeight;

  @ValidateNested()
  @Type(() => ContentInfo)
  contentInfo: ContentInfo;
}
