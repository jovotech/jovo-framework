import { PlatformOutputTemplate, Type } from '@jovotech/output';
import { DialogflowResponse } from './DialogflowResponse';

export class DialogflowOutputTemplate extends PlatformOutputTemplate<DialogflowResponse> {
  @Type(() => DialogflowResponse)
  nativeResponse?: DialogflowResponse;
}
