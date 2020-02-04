import { RequestBuilder } from 'jovo-core';
import { BixbyRequest } from './BixbyRequest';

export class BixbyRequestBuilder implements RequestBuilder<BixbyRequest> {
  type = 'BixbyCapsule';

  // tslint:disable:no-any
  async launch(json?: any): Promise<BixbyRequest> {
    return await this.launchRequest(json);
  }

  // tslint:disable:no-any
  async launchRequest(json?: any): Promise<BixbyRequest> {
    return BixbyRequest.fromJSON(json, { intent: 'LAUNCH' });
  }

  intent(json?: object | undefined): Promise<BixbyRequest>;
  intent(name?: string | undefined, slots?: any): Promise<BixbyRequest>;
  // tslint:disable:no-any
  intent(name?: any, slots?: any) {
    return new Promise<BixbyRequest>((res, rej) => {});
  }
  audioPlayerRequest(json?: object | undefined): Promise<BixbyRequest> {
    throw new Error('Method not implemented.');
  }
  end(json?: object | undefined): Promise<BixbyRequest> {
    throw new Error('Method not implemented.');
  }
  rawRequest(json: object): Promise<BixbyRequest> {
    throw new Error('Method not implemented.');
  }
  rawRequestByKey(key: string): Promise<BixbyRequest> {
    throw new Error('Method not implemented.');
  }
}
