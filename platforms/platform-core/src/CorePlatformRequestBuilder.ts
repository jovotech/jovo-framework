import { join as joinPaths } from 'path';
import { RequestBuilder } from '@jovotech/framework';
import { CorePlatformRequest } from './CorePlatformRequest';
import { CorePlatform } from './CorePlatform';

export class CorePlatformRequestBuilder extends RequestBuilder<CorePlatform> {
  launch(json?: Record<string, unknown>): CorePlatformRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths('..', 'sample-requests', 'LaunchRequest.json'));
    const request: CorePlatformRequest = Object.create(CorePlatformRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): CorePlatformRequest;
  intent(json?: Record<string, unknown>): CorePlatformRequest;
  intent(json?: any): CorePlatformRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths('..', 'sample-requests', 'IntentRequest.json'));
    const request: CorePlatformRequest = Object.create(CorePlatformRequest.prototype);
    return Object.assign(request, json || intentJson);
  }
}
