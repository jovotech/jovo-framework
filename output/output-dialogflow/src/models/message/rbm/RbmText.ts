import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  Type,
  ArrayMinSize,
} from '@jovotech/output';
import { RBM_TEXT_SUGGESTIONS_MIN_SIZE } from '../../../constants';
import { RbmSuggestion } from './RbmSuggestion';

export class RbmText {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(RBM_TEXT_SUGGESTIONS_MIN_SIZE)
  @ValidateNested()
  @Type(() => RbmSuggestion)
  rbm_suggestion?: RbmSuggestion[];
}
