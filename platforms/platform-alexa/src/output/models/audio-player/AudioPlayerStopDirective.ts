import { Equals } from '@jovotech/output';
import { Directive } from '../Directive';

export class AudioPlayerStopDirective extends Directive<'AudioPlayer.Stop'> {
  @Equals('AudioPlayer.Stop')
  type!: 'AudioPlayer.Stop';
}
