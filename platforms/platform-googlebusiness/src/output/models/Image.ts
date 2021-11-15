import { Type, ValidateNested } from '@jovotech/output';
import { ContentInfo } from './common/ContentInfo';

export class Image {
  @ValidateNested()
  @Type(() => ContentInfo)
  contentInfo!: ContentInfo;
}
