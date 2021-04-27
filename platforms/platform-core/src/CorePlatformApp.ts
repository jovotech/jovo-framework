import { Jovo } from '@jovotech/framework';
import { CorePlatformResponse } from '@jovotech/output-core';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformApp extends Jovo<CorePlatformRequest, CorePlatformResponse> {
  isNewSession(): boolean {
    return this.$request.context?.session?.new ?? true;
  }
}
