import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { GoogleBusinessOutputTemplateResponse } from './GoogleBusinessOutputTemplateResponse';

export class GoogleBusinessOutputTemplate extends PlatformOutputTemplate<GoogleBusinessOutputTemplateResponse> {
  @Type(() => GoogleBusinessOutputTemplateResponse)
  nativeResponse?: GoogleBusinessOutputTemplateResponse;
}
