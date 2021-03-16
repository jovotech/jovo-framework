import { ArrayMaxSize, ArrayMinSize, IsArray, IsOptional, Type, ValidateNested } from '@jovotech/output';
import { IsValidRichResponseItemArray } from '../decorators/validation/IsValidRichResponseItemArray';
import { Suggestion } from './common/Suggestion';
import { LinkOutSuggestion } from './LinkOutSuggestion';
import { RichResponse } from './RichResponse';
import { RichResponseItem } from './RichResponseItem';

export class OutputRichResponse implements Partial<RichResponse> {
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({
    each: true,
  })
  @IsValidRichResponseItemArray()
  @Type(() => RichResponseItem)
  items?: RichResponseItem[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(8)
  @ValidateNested({ each: true })
  @Type(() => Suggestion)
  suggestions?: Suggestion[];

  @IsOptional()
  @ValidateNested()
  linkOutSuggestion?: LinkOutSuggestion;
}
