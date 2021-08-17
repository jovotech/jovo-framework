import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsOptional,
  Type,
  ValidateNested,
} from '@jovotech/output';
import { RICH_RESPONSE_ITEMS_MIN_SIZE, SUGGESTIONS_MAX_SIZE } from '../constants';
import { IsValidRichResponseItemArray } from '../decorators/validation/IsValidRichResponseItemArray';
import { Suggestion } from './common/Suggestion';
import { LinkOutSuggestion } from './LinkOutSuggestion';
import { RichResponseItem } from './RichResponseItem';

export class RichResponse {
  @IsArray()
  @ArrayMinSize(RICH_RESPONSE_ITEMS_MIN_SIZE)
  @ValidateNested({
    each: true,
  })
  @IsValidRichResponseItemArray()
  @Type(() => RichResponseItem)
  items: RichResponseItem[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(SUGGESTIONS_MAX_SIZE)
  @ValidateNested({ each: true })
  @Type(() => Suggestion)
  suggestions?: Suggestion[];

  @IsOptional()
  @ValidateNested()
  linkOutSuggestion?: LinkOutSuggestion;
}
