import { RequestBuilder } from '@jovotech/framework';
import { readFileSync } from 'fs';
import { join as joinPaths } from 'path';
import { AlexaPlatform } from './AlexaPlatform';
import { AlexaRequest } from './AlexaRequest';

export class AlexaRequestBuilder extends RequestBuilder<AlexaPlatform> {
  launch(json?: Record<string, unknown>): AlexaRequest {
    const launchJson = readFileSync(
      joinPaths(__dirname, '..', '..', 'sample-requests', 'LaunchRequest.json'),
      {
        encoding: 'utf-8',
      },
    );
    const request: AlexaRequest = Object.create(AlexaRequest.prototype);
    return Object.assign(request, json || JSON.parse(launchJson));
  }

  intent(name?: string): AlexaRequest;
  intent(json?: Record<string, unknown>): AlexaRequest;
  intent(nameOrJson?: string | Record<string, unknown>): AlexaRequest {
    // TODO: Replace readFileSync() with require()
    const intentJson = readFileSync(
      joinPaths(__dirname, '..', '..', 'sample-requests', 'IntentRequest.json'),
      {
        encoding: 'utf-8',
      },
    );
    const request: AlexaRequest = Object.create(AlexaRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, JSON.parse(intentJson));
      request.setIntent(nameOrJson);
    } else {
      Object.assign(request, nameOrJson || JSON.parse(intentJson));
    }

    return request;
  }
}
