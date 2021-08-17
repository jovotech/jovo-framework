import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { CoreOutputTemplateResponse } from './CoreOutputTemplateResponse';

export class CoreOutputTemplate extends PlatformOutputTemplate<CoreOutputTemplateResponse> {
  @Type(() => CoreOutputTemplateResponse)
  nativeResponse?: CoreOutputTemplateResponse;
}
