import { RequestBuilder } from '@jovotech/framework';
import { UnknownObject } from '@jovotech/framework';
import { join as joinPaths } from 'path';
import { GoogleAssistantPlatform } from './GoogleAssistantPlatform';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAssistantRequestBuilder extends RequestBuilder<GoogleAssistantPlatform> {
  launch(json?: UnknownObject): GoogleAssistantRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'LaunchRequest.json',
    ));
    const request: GoogleAssistantRequest = Object.create(GoogleAssistantRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): GoogleAssistantRequest;
  intent(json?: UnknownObject): GoogleAssistantRequest;
  intent(nameOrJson?: string | UnknownObject): GoogleAssistantRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'IntentRequest.json',
    ));

    const request: GoogleAssistantRequest = Object.create(GoogleAssistantRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, intentJson);
      request.setIntent(nameOrJson);
    } else {
      Object.assign(request, nameOrJson || intentJson);
    }

    return request;
  }
}
