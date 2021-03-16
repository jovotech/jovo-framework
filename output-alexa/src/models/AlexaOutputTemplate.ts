import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { AlexaOutputTemplateResponse } from './AlexaOutputTemplateResponse';

export class AlexaOutputTemplate extends PlatformOutputTemplate<AlexaOutputTemplateResponse> {
  @Type(() => AlexaOutputTemplateResponse)
  nativeResponse?: AlexaOutputTemplateResponse;
}
