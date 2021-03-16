import { PlatformOutput, Type } from '@jovotech/output';
import { AlexaOutputResponse } from './AlexaOutputResponse';

export class AlexaOutput extends PlatformOutput<AlexaOutputResponse> {
  @Type(() => AlexaOutputResponse)
  nativeResponse?: AlexaOutputResponse;
}
