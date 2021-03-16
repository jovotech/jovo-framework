import {
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
  Type,
  ArrayMinSize,
} from '@jovotech/output';
import { RbmSuggestion } from './RbmSuggestion';

export class RbmText {
  @IsString()
  @IsNotEmpty()
  text: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested()
  @Type(() => RbmSuggestion)
  rbm_suggestion?: RbmSuggestion[];
}
