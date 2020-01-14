import { RequestBuilder } from 'jovo-core';
import { AutopilotRequest } from './AutopilotRequest';

/**
 * TODO
 */
export class AutopilotRequestBuilder implements RequestBuilder<AutopilotRequest> {
  type = 'AutopilotBot';

  async launch(json?: object): Promise<AutopilotRequest> {
    return new AutopilotRequest();
  }

  async intent(json?: object): Promise<AutopilotRequest>;
  async intent(name?: string, slots?: any): Promise<AutopilotRequest>; // tslint:disable-line:no-any
  async intent(obj?: any, inputs?: any): Promise<AutopilotRequest> {
    // tslint:disable-line:no-any
    return new AutopilotRequest();
  }

  async audioPlayerRequest(json?: object): Promise<AutopilotRequest> {
    return new AutopilotRequest();
  }

  async end(json?: object): Promise<AutopilotRequest> {
    return new AutopilotRequest();
  }

  async rawRequest(json: object): Promise<AutopilotRequest> {
    return new AutopilotRequest();
  }

  async rawRequestByKey(key: string): Promise<AutopilotRequest> {
    return new AutopilotRequest();
  }
}
