import { Jovo } from '@jovotech/core';
import { CorePlatformResponse } from '@jovotech/output-core';
import { CorePlatformRequest } from './CorePlatformRequest';

export class CorePlatformApp extends Jovo<CorePlatformRequest, CorePlatformResponse> {
  test() {
    console.log('test');
  }
}
