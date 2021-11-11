import { NormalizedPlatformOutputTemplate, Type } from '@jovotech/output';
import { DialogflowResponse } from '../../DialogflowResponse';

export class NormalizedDialogflowOutputTemplate extends NormalizedPlatformOutputTemplate<DialogflowResponse> {
  @Type(() => DialogflowResponse)
  nativeResponse?: DialogflowResponse;
}
