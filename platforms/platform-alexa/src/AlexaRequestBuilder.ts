import { RequestBuilder, UnknownObject } from '@jovotech/framework';
import { join as joinPaths } from 'path';
import { AlexaPlatform } from './AlexaPlatform';
import { AlexaRequest } from './AlexaRequest';

export class AlexaRequestBuilder extends RequestBuilder<AlexaPlatform> {
  launch(json?: UnknownObject): AlexaRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const launchJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'LaunchRequest.json',
    ));
    const request: AlexaRequest = Object.create(AlexaRequest.prototype);
    return Object.assign(request, json || launchJson);
  }

  intent(name?: string): AlexaRequest;
  intent(json?: UnknownObject): AlexaRequest;
  intent(nameOrJson?: string | UnknownObject): AlexaRequest {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const intentJson = require(joinPaths(
      __dirname,
      '..',
      '..',
      'sample-requests',
      'IntentRequest.json',
    ));
    const request: AlexaRequest = Object.create(AlexaRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, intentJson);
      request.setIntent(nameOrJson);
    } else {
      Object.assign(request, nameOrJson || intentJson);
    }

    return request;
  }
}
