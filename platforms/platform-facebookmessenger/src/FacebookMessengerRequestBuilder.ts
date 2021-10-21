import { RequestBuilder } from '@jovotech/framework';
import { join as joinPaths } from 'path';
import { FacebookMessengerPlatform, FacebookMessengerRequest } from '.';
import { UnknownObject } from '@jovotech/framework';

export class FacebookMessengerRequestBuilder extends RequestBuilder<FacebookMessengerPlatform> {
  launch(json?: UnknownObject): FacebookMessengerRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'LaunchRequest.json',
    ));
    const request: FacebookMessengerRequest = Object.create(FacebookMessengerRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): FacebookMessengerRequest;
  intent(json?: UnknownObject): FacebookMessengerRequest;
  intent(nameOrJson?: string | UnknownObject): FacebookMessengerRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'IntentRequest.json',
    ));

    const request: FacebookMessengerRequest = Object.create(FacebookMessengerRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, intentJson);
      request.setIntent(nameOrJson);
    } else {
      Object.assign(request, nameOrJson || intentJson);
    }

    return request;
  }
}
