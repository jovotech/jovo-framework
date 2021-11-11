import { RequestBuilder, UnknownObject } from '@jovotech/framework';

import { join as joinPaths } from 'path';
import { GoogleBusinessPlatform } from './GoogleBusinessPlatform';
import { GoogleBusinessRequest } from './GoogleBusinessRequest';

export class GoogleBusinessRequestBuilder extends RequestBuilder<GoogleBusinessPlatform> {
  launch(json?: UnknownObject): GoogleBusinessRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'IntentRequest.json',
    ));
    const request: GoogleBusinessRequest = Object.create(GoogleBusinessRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): GoogleBusinessRequest;
  intent(json?: UnknownObject): GoogleBusinessRequest;
  intent(nameOrJson?: string | UnknownObject): GoogleBusinessRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'IntentRequest.json',
    ));

    const request: GoogleBusinessRequest = Object.create(GoogleBusinessRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, intentJson);
    } else {
      Object.assign(request, nameOrJson || intentJson);
    }

    return request;
  }
}
