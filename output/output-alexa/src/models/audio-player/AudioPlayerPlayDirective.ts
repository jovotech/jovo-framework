import { Equals, IsEnum, Type, ValidateNested } from '@jovotech/output';
import { PlayBehavior, PlayBehaviorLike } from '../common/OutputSpeech';
import { Directive } from '../Directive';
import { AudioItem } from './AudioItem';

export class AudioPlayerPlayDirective extends Directive<'AudioPlayer.Play'> {
  @Equals('AudioPlayer.Play')
  type: 'AudioPlayer.Play';

  @IsEnum(PlayBehavior)
  playBehavior: PlayBehaviorLike;

  @ValidateNested()
  @Type(() => AudioItem)
  audioItem: AudioItem;
}
