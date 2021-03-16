import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { DialogflowResponse } from './DialogflowResponse';

export class DialogflowOutput extends PlatformOutputTemplate<DialogflowResponse> {
  @Type(() => DialogflowResponse)
  nativeResponse?: DialogflowResponse;
}
