import { PlatformOutputTemplate, Type, IsOptional, ValidateNested } from '@jovotech/output';
import { AlexaOutputTemplateResponse } from './AlexaOutputTemplateResponse';
import { AplList } from './apl/AplList';

export class AlexaOutputTemplate extends PlatformOutputTemplate<AlexaOutputTemplateResponse> {
  @Type(() => AlexaOutputTemplateResponse)
  nativeResponse?: AlexaOutputTemplateResponse;

  @IsOptional()
  @ValidateNested()
  @Type(() => AplList)
  list?: AplList;
}
