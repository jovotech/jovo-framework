import { RequestBuilder } from '@jovotech/framework';
import { readFileSync } from 'fs';
import { join as joinPaths } from 'path';
import { GoogleAssistantPlatform } from './GoogleAssistantPlatform';
import { GoogleAssistantRequest } from './GoogleAssistantRequest';

export class GoogleAssistantRequestBuilder extends RequestBuilder<GoogleAssistantPlatform> {
  launch(json?: Record<string, unknown>): GoogleAssistantRequest {
    const launchJson = readFileSync(
      joinPaths(__dirname, '..', '..', 'sample-requests', 'LaunchRequest.json'),
      {
        encoding: 'utf-8',
      },
    );
    const request: GoogleAssistantRequest = Object.create(GoogleAssistantRequest.prototype);
    return Object.assign(request, json || JSON.parse(launchJson));
  }

  intent(name?: string): GoogleAssistantRequest;
  intent(json?: Record<string, unknown>): GoogleAssistantRequest;
  intent(nameOrJson?: string | Record<string, unknown>): GoogleAssistantRequest {
    // TODO: Replace readFileSync() with require()
    const intentJson = readFileSync(
      joinPaths(__dirname, '..', '..', 'sample-requests', 'IntentRequest.json'),
      {
        encoding: 'utf-8',
      },
    );
    const request: GoogleAssistantRequest = Object.create(GoogleAssistantRequest.prototype);

    if (typeof nameOrJson === 'string') {
      Object.assign(request, JSON.parse(intentJson));
      request.setIntent(nameOrJson);
    } else {
      Object.assign(request, nameOrJson || JSON.parse(intentJson));
    }

    return request;
  }
}
