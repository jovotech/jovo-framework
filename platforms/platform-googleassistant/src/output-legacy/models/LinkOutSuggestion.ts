import { IsNotEmpty, IsString, MaxLength, Type, ValidateNested } from '@jovotech/output';
import { LINK_OUT_SUGGESTION_DESTINATION_NAME_MAX_LENGTH } from '../constants';
import { OpenUrlAction } from './common/OpenUrlAction';

export class LinkOutSuggestion {
  @IsString()
  @IsNotEmpty()
  @MaxLength(LINK_OUT_SUGGESTION_DESTINATION_NAME_MAX_LENGTH)
  destinationName!: string;

  @ValidateNested()
  @Type(() => OpenUrlAction)
  openUrlAction!: OpenUrlAction;
}
