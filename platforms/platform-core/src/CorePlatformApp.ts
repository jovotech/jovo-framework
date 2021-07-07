import { Jovo } from '@jovotech/framework';
import { CorePlatformResponse } from '@jovotech/output-core';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformApp extends Jovo<CorePlatformRequest, CorePlatformResponse> {
  hasScreenInterface(): boolean {
    return !!this.$request.context?.device?.capabilities?.HTML;
  }
}
