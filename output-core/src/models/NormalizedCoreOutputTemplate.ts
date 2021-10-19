import { NormalizedPlatformOutputTemplate, Type } from '@jovotech/output';
import { CoreOutputTemplateResponse } from './CoreOutputTemplateResponse';

export class NormalizedCoreOutputTemplate extends NormalizedPlatformOutputTemplate<CoreOutputTemplateResponse> {
  @Type(() => CoreOutputTemplateResponse)
  nativeResponse?: CoreOutputTemplateResponse;
}
