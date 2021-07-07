import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { join as joinPaths } from 'path';
import { AlexaRequest } from './AlexaRequest';

export class AlexaRequestBuilder {
  static launch(): AlexaRequest {
    // const launchJson = require(joinPaths('..', 'sample-requests', 'LaunchRequest.json'));
    const launchJson = readFileSync(
      joinPaths(__dirname, '..', '..', 'sample-requests', 'LaunchRequest.json'),
      {
        encoding: 'utf-8',
      },
    );
    const request: AlexaRequest = Object.create(AlexaRequest.prototype);
    return Object.assign(request, JSON.parse(launchJson));
  }
}
