import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { AlexaOutputResponse } from './AlexaOutputResponse';

export class AlexaOutput extends PlatformOutputTemplate<AlexaOutputResponse> {
  @Type(() => AlexaOutputResponse)
  nativeResponse?: AlexaOutputResponse;
}
