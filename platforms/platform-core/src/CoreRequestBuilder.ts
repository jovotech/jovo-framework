import { join as joinPaths } from 'path';
import { RequestBuilder } from '@jovotech/framework';
import { CoreRequest } from './CoreRequest';
import { CorePlatform } from './CorePlatform';

export class CoreRequestBuilder extends RequestBuilder<CorePlatform> {
  launch(json?: Record<string, unknown>): CoreRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths('..', 'sample-requests', 'LaunchRequest.json'));
    const request: CoreRequest = Object.create(CoreRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): CoreRequest;
  intent(json?: Record<string, unknown>): CoreRequest;
  intent(json?: string | Record<string, unknown>): CoreRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths('..', 'sample-requests', 'IntentRequest.json'));
    const request: CoreRequest = Object.create(CoreRequest.prototype);
    return Object.assign(request, json || intentJson);
  }
}
