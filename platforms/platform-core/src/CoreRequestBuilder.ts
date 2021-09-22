import { RequestBuilder, UnknownObject } from '@jovotech/framework';
import { join as joinPaths } from 'path';
import { CorePlatform } from './CorePlatform';
import { CoreRequest } from './CoreRequest';

export class CoreRequestBuilder extends RequestBuilder<CorePlatform> {
  launch(json?: UnknownObject): CoreRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'LaunchRequest.json',
    ));
    const request: CoreRequest = Object.create(CoreRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): CoreRequest;
  intent(json?: UnknownObject): CoreRequest;
  intent(nameOrJson?: string | UnknownObject): CoreRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'IntentRequest.json',
    ));

    const request: CoreRequest = Object.create(CoreRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, intentJson);
      request.setIntent(nameOrJson);
    } else {
      Object.assign(request, nameOrJson || intentJson);
    }

    return request;
  }
}
