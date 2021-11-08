import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { RICH_RESPONSE_ITEMS_MIN_SIZE, LEGACY_SUGGESTIONS_MAX_SIZE } from '../constants';
import { IsValidRichResponseItemArray } from '../decorators/validation/IsValidRichResponseItemArray';
import { LegacySuggestion } from './common/LegacySuggestion';
import { LinkOutSuggestion } from './LinkOutSuggestion';
import { RichResponse } from './RichResponse';
import { RichResponseItem } from './RichResponseItem';

export class OutputRichResponse implements Partial<RichResponse> {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(RICH_RESPONSE_ITEMS_MIN_SIZE)
  @ValidateNested({
    each: true,
  })
  @IsValidRichResponseItemArray()
  @Type(() => RichResponseItem)
  items?: RichResponseItem[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(LEGACY_SUGGESTIONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => LegacySuggestion)
  suggestions?: LegacySuggestion[];

  @IsOptional()
  @ValidateNested()
  linkOutSuggestion?: LinkOutSuggestion;
}
