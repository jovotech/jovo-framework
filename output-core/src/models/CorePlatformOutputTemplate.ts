import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { CorePlatformOutputTemplateResponse } from './CorePlatformOutputTemplateResponse';

export class CorePlatformOutputTemplate extends PlatformOutputTemplate<CorePlatformOutputTemplateResponse> {
  @Type(() => CorePlatformOutputTemplateResponse)
  nativeResponse?: CorePlatformOutputTemplateResponse;
}
