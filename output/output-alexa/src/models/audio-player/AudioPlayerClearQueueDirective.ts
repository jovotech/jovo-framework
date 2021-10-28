import { EnumLike, Equals, IsEnum } from '@jovotech/output';

export enum ClearBehavior {
  Enqueued = 'CLEAR_ENQUEUED',
  All = 'CLEAR_ALL',
}

export type ClearBehaviorLike = EnumLike<ClearBehavior>;

export class AudioPlayerClearQueueDirective {
  @Equals('AudioPlayer.ClearQueue')
  type: 'AudioPlayer.ClearQueue';

  @IsEnum(ClearBehavior)
  clearBehavior: ClearBehaviorLike;
}
