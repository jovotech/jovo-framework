import { Type } from '@jovotech/output';
import { IsValidSuggestedActionObject } from '../../decorators/validation/IsValidSuggestedActionObject';
import { DialAction } from './DialAction';
import { OpenUrlAction } from './OpenUrlAction';
import { SuggestedReply } from './SuggestedReply';

export class SuggestedAction extends SuggestedReply {
  @IsValidSuggestedActionObject()
  @Type(() => OpenUrlAction)
  openUrlAction?: OpenUrlAction;

  @IsValidSuggestedActionObject()
  @Type(() => DialAction)
  dialAction?: DialAction;
}
