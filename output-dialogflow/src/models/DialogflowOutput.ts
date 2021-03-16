import { PlatformOutput, Type } from '@jovotech/output';
import { DialogflowResponse } from './DialogflowResponse';

export class DialogflowOutput extends PlatformOutput<DialogflowResponse> {
  @Type(() => DialogflowResponse)
  nativeResponse?: DialogflowResponse;
}
