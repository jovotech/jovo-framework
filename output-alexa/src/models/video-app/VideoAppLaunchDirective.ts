import { Equals, Type, ValidateNested } from '@jovotech/output';
import { Directive } from '../Directive';
import { VideoItem } from './VideoItem';

export class VideoAppLaunchDirective extends Directive<'VideoApp.Launch'> {
  @Equals('VideoApp.Launch')
  type: 'VideoApp.Launch';

  @ValidateNested()
  @Type(() => VideoItem)
  videoItem: VideoItem;
}
